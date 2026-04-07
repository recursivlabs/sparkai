import { NextResponse } from "next/server";
import { getRecursiv } from "@/lib/recursiv";
import { ORG_ID } from "@/lib/constants";
import { query } from "@/lib/db";

const SYSTEM_PROMPT = `You are the SPARK AI Assistant — an expert on SPARK AI Network, SDSC's industry-focused AI consortium at UC San Diego.

## What You Know
- SPARK AI advances AI knowledge, strategy, and practice for business, healthcare, government, research, and human potential
- The consortium connects industry leaders, researchers, and advisors
- Membership tiers: Community (free), Forum (paid), ARC (paid)
- Events, research papers, and insights are published regularly
- SDSC (San Diego Supercomputer Center) is the institutional home

## Your Tools
You have access to search_web and browser_use. Use them to:
- Look up the latest AI research and news relevant to SPARK AI's mission
- Find information about SDSC, UC San Diego, and partner organizations
- Research specific AI topics members ask about

## Your Style
- Professional but approachable — this is an academic/industry consortium
- Reference real research and data when possible
- Help members understand AI's impact on their specific industry
- Suggest relevant SPARK AI events and research when appropriate`;

/**
 * GET /api/agent
 * Returns the SparkAI agent, creating it if it doesn't exist.
 */
export async function GET() {
  try {
    const r = getRecursiv();

    // Check if we already have an agent_id stored
    const rows = await query(
      `SELECT value FROM app_config WHERE key = 'sparkai_agent_id'`
    );

    if (rows && Array.isArray(rows) && rows.length > 0) {
      const agentId = (rows[0] as { value: string }).value;
      try {
        const { data: agent } = await r.agents.get(agentId);
        return NextResponse.json({ agent });
      } catch {
        // Agent was deleted or invalid — fall through to create a new one
      }
    }

    // Create a new agent
    const { data: newAgent } = await r.agents.create({
      name: "SPARK AI Assistant",
      username: `spark_ai_${String(Date.now()).slice(-6)}`,
      model: "anthropic/claude-sonnet-4.6",
      system_prompt: SYSTEM_PROMPT,
      social_mode: "chat_only",
      tool_mode: "autonomous",
      daily_request_limit: 200,
      organization_id: ORG_ID,
    });

    // Store the agent_id in the database
    await query(
      `INSERT INTO app_config (key, value, updated_at)
       VALUES ('sparkai_agent_id', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [newAgent.id]
    );

    // Fetch the full agent detail
    const { data: agent } = await r.agents.get(newAgent.id);
    return NextResponse.json({ agent });
  } catch (error) {
    console.error("Error getting/creating agent:", error);
    return NextResponse.json(
      { error: "Failed to get or create agent" },
      { status: 500 }
    );
  }
}
