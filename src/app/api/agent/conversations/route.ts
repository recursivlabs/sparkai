import { NextResponse } from "next/server";
import { getRecursiv } from "@/lib/recursiv";
import { getSessionUser } from "@/lib/session";
import { query } from "@/lib/db";

/**
 * GET /api/agent/conversations
 * Lists conversations with the SparkAI agent.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get the agent ID from the database
  const rows = await query(
    `SELECT value FROM app_config WHERE key = 'sparkai_agent_id'`
  );
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ conversations: [] });
  }
  const agentId = (rows[0] as { value: string }).value;

  try {
    const r = getRecursiv();
    const { data: conversations } = await r.agents.conversations(agentId, {
      limit: 50,
    });
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error listing conversations:", error);
    return NextResponse.json({ conversations: [] });
  }
}
