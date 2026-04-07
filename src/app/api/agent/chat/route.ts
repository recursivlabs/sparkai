import { NextRequest, NextResponse } from "next/server";
import { getRecursiv } from "@/lib/recursiv";
import { getSessionUser } from "@/lib/session";
import { query } from "@/lib/db";

/**
 * POST /api/agent/chat
 * Sends a message to the SparkAI agent and streams the response via SSE.
 * Body: { message: string, conversation_id?: string }
 */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { message, conversation_id } = body as {
    message: string;
    conversation_id?: string;
  };

  if (!message?.trim()) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  // Get the agent ID from the database
  const rows = await query(
    `SELECT value FROM app_config WHERE key = 'sparkai_agent_id'`
  );
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json(
      { error: "Agent not configured. Visit /agent to initialize." },
      { status: 404 }
    );
  }
  const agentId = (rows[0] as { value: string }).value;

  const r = getRecursiv();

  // Try streaming first
  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const chatInput: { message: string; conversation_id?: string } = {
            message: message.trim(),
          };
          if (conversation_id) {
            chatInput.conversation_id = conversation_id;
          }

          const gen = r.agents.chatStream(agentId, chatInput);

          for await (const chunk of gen) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));

            if (chunk.type === "done" || chunk.type === "error") {
              break;
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          // If streaming fails, send an error event then close
          const errMsg =
            err instanceof Error ? err.message : "Stream failed";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    // Fallback to non-streaming chat
    try {
      const chatInput: { message: string; conversation_id?: string } = {
        message: message.trim(),
      };
      if (conversation_id) {
        chatInput.conversation_id = conversation_id;
      }

      const { data } = await r.agents.chat(agentId, chatInput);
      return NextResponse.json({ data });
    } catch (error) {
      console.error("Agent chat error:", error);
      return NextResponse.json(
        { error: "Failed to chat with agent" },
        { status: 500 }
      );
    }
  }
}
