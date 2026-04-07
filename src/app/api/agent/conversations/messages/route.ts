import { NextRequest, NextResponse } from "next/server";
import { getRecursiv } from "@/lib/recursiv";
import { getSessionUser } from "@/lib/session";

/**
 * GET /api/agent/conversations/messages?conversation_id=xxx
 * Lists messages in a conversation.
 */
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get("conversation_id");
  if (!conversationId) {
    return NextResponse.json(
      { error: "conversation_id is required" },
      { status: 400 }
    );
  }

  try {
    const r = getRecursiv();
    const { data: messages } = await r.chat.messages(conversationId, {
      limit: 100,
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error loading messages:", error);
    return NextResponse.json({ messages: [] });
  }
}
