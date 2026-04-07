/**
 * Recursiv platform IDs for SPARK AI.
 *
 * These must be set in .env.local after creating the org and project
 * via the Recursiv dashboard or MCP tools:
 *   - mcp__recursiv__create_org({ name: "SPARK AI", slug: "sparkai" })
 *   - mcp__recursiv__create_project({ name: "sparkai-web", organization_id: orgId })
 */

/** The Recursiv organization ID for SPARK AI */
export const ORG_ID = process.env.RECURSIV_ORG_ID || "TODO_CREATE_ORG_AND_SET_ID";

/** The Recursiv project ID for the SparkAI web app */
export const PROJECT_ID = process.env.RECURSIV_PROJECT_ID || "TODO_CREATE_PROJECT_AND_SET_ID";

/** Database name for app data (RSVPs, etc.) */
export const DB_NAME = "sparkai";

/** Storage bucket name for PDFs and assets */
export const STORAGE_BUCKET = "papers";
