import { Client as McpClient } from "@modelcontextprotocol/sdk/client/index.js";
import { LLMClient } from "./llmClient";

export async function prepareToolsForLLM(mcpClient: McpClient) {
  // Get available tools from MCP server
  const toolsResult = await mcpClient.listTools();

  const formattedTools = toolsResult.tools.map((tool) => ({
    name: tool.name,
    description: tool.description || `Tool: ${tool.name}`,
    parameters: tool.inputSchema,
    type: tool.type || "function", // Required by the
  }));

  return formattedTools;
}

// Using the formatted tools with an LLM
// NOTE: UNUSED
async function queryLLMWithTools(
  llmClient: LLMClient,
  formattedTools,
  userQuery: string
) {
  // const messages = [{ role: "user", content: userQuery }];

  // Pass the tools to the LLM
  // The exact API will depend on your LLM provider
  const response = await llmClient.sendMessage(userQuery, formattedTools);

  return response;
}
