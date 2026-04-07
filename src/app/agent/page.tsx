"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  Loader2,
  Menu,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface ConversationSummary {
  id: string;
  last_message: { content: string; created_at: string } | null;
  created_at: string;
}

// ── Markdown-lite renderer ─────────────────────────────────────────

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-5 my-2 space-y-1">
          {listItems.map((item, i) => (
            <li key={i}>{processInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  function processInline(line: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*)|(\[([^\]]+)\]\(([^)]+)\))|(`([^`]+)`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      if (match[1]) {
        parts.push(<strong key={`b-${match.index}`} className="font-semibold text-white">{match[2]}</strong>);
      } else if (match[3]) {
        parts.push(
          <a key={`a-${match.index}`} href={match[5]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
            {match[4]}
          </a>
        );
      } else if (match[6]) {
        parts.push(<code key={`c-${match.index}`} className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-sm">{match[7]}</code>);
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    return parts.length > 0 ? parts : line;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^[-*]\s+/.test(line)) { listItems.push(line.replace(/^[-*]\s+/, "")); continue; }
    if (/^\d+\.\s+/.test(line)) { listItems.push(line.replace(/^\d+\.\s+/, "")); continue; }
    flushList();
    if (line.startsWith("### ")) {
      elements.push(<h4 key={i} className="text-white font-semibold text-sm mt-3 mb-1">{processInline(line.slice(4))}</h4>);
    } else if (line.startsWith("## ")) {
      elements.push(<h3 key={i} className="text-white font-semibold mt-3 mb-1">{processInline(line.slice(3))}</h3>);
    } else if (line.startsWith("# ")) {
      elements.push(<h2 key={i} className="text-white font-bold text-lg mt-3 mb-1">{processInline(line.slice(2))}</h2>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="leading-relaxed">{processInline(line)}</p>);
    }
  }
  flushList();
  return <div className="space-y-1">{elements}</div>;
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

// ── Main Chat Page ─────────────────────────────────────────────────

export default function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentReady, setAgentReady] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const shouldAutoScroll = useRef(true);

  // Track whether user is near the bottom
  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const threshold = 100;
    shouldAutoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }

  // Smooth scroll to bottom only when near bottom
  useEffect(() => {
    if (shouldAutoScroll.current && scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    async function checkAuthAndInit() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const data = sessionRes.ok ? await sessionRes.json() : null;
        if (!data?.user) { setAuthError(true); setAuthChecked(true); return; }
        setAuthChecked(true);
        const agentRes = await fetch("/api/agent");
        if (!agentRes.ok) throw new Error("Failed to initialize agent");
        await agentRes.json();
        setAgentReady(true);
      } catch (err) {
        if (!authError) {
          setAgentError(err instanceof Error ? err.message : "Failed to load agent");
        }
      }
    }
    checkAuthAndInit();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/agent/conversations");
      if (res.ok) {
        const { conversations: convos } = await res.json();
        setConversations(convos || []);
      }
    } catch { /* Silently fail */ }
  }, []);

  useEffect(() => {
    if (agentReady && !authError) loadConversations();
  }, [agentReady, authError, loadConversations]);

  async function loadConversation(convId: string) {
    setConversationId(convId);
    setSidebarOpen(false);
    try {
      const res = await fetch(`/api/agent/conversations/messages?conversation_id=${convId}`);
      if (res.ok) {
        const { messages: msgs } = await res.json();
        const formatted: ChatMessage[] = (msgs || []).reverse().map(
          (m: { id: string; content: string; sender: { is_ai: boolean }; created_at: string }) => ({
            id: m.id,
            role: m.sender?.is_ai ? "assistant" : "user",
            content: m.content,
            created_at: m.created_at,
          })
        );
        setMessages(formatted);
      }
    } catch { /* Silently fail */ }
  }

  function startNewChat() {
    setConversationId(null);
    setMessages([]);
    setSidebarOpen(false);
    inputRef.current?.focus();
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    shouldAutoScroll.current = true; // Always scroll when user sends

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, conversation_id: conversationId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `HTTP ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";
        let gotConversationId = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const chunk = JSON.parse(data);
                if (chunk.type === "text_delta" && chunk.delta) {
                  accumulated += chunk.delta;
                  setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: accumulated } : m));
                } else if (chunk.type === "error") {
                  accumulated += `\n\n_Error: ${chunk.error || "Unknown error"}_`;
                  setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: accumulated } : m));
                }
                if (chunk.conversation_id && !gotConversationId) {
                  setConversationId(chunk.conversation_id);
                  gotConversationId = true;
                }
              } catch { /* Skip malformed JSON */ }
            }
          }
        }
        if (!accumulated) {
          setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: "I received your message. Let me think about that..." } : m));
        }
      } else {
        const json = await res.json();
        const content = json.data?.content || "I received your message.";
        if (json.data?.conversation_id) setConversationId(json.data.conversation_id);
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content } : m));
      }
      loadConversations();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send message";
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: `Sorry, something went wrong: ${errorMsg}` } : m));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }

  // ── Loading / Auth / Error states ────────────────────────────────

  if (!authChecked) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Sign in to chat</h2>
          <p className="text-slate-400 mb-6">Log in to your SPARK AI account to access the AI Assistant.</p>
          <a href="/auth" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (agentError) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Agent unavailable</h2>
          <p className="text-slate-400">{agentError}</p>
        </div>
      </div>
    );
  }

  if (!agentReady) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400">Initializing SPARK AI Agent...</p>
        </div>
      </div>
    );
  }

  // ── Main chat UI ───────────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-4rem)] bg-black flex overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-800 flex flex-col transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <button
            onClick={startNewChat}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    conversationId === conv.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <div className="truncate">{conv.last_message?.content?.slice(0, 60) || "New conversation"}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {conv.last_message?.created_at
                      ? new Date(conv.last_message.created_at).toLocaleDateString()
                      : new Date(conv.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 bg-black border-b border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">SPARK AI Agent</h1>
              <p className="text-xs text-slate-500">Ask anything about SPARK AI</p>
            </div>
          </div>
        </div>

        {/* Messages — single scroll container */}
        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-lg px-4">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center border border-blue-500/10">
                  <Sparkles className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">SPARK AI Agent</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Ask me anything about SPARK AI Network, AI research, SDSC, or how AI is transforming your industry.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["What is SPARK AI Network?", "Latest AI research from SDSC", "How can AI help healthcare?", "Upcoming SPARK AI events"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => { setInput(suggestion); setTimeout(() => inputRef.current?.focus(), 50); }}
                      className="text-left px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white hover:border-slate-700 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-slate-900/80 border border-slate-800 text-slate-300"
                  }`}>
                    {msg.role === "assistant" && msg.content === "" ? (
                      <LoadingDots />
                    ) : msg.role === "assistant" ? (
                      renderMarkdown(msg.content)
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center mt-1">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-slate-800 bg-black px-4 py-3">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
            <div className="flex items-end bg-slate-900/80 border border-slate-700 rounded-2xl focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask SPARK AI Agent..."
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent text-white placeholder-slate-500 px-4 py-3.5 resize-none outline-none text-sm max-h-[200px] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex-shrink-0 p-2.5 m-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
