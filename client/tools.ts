import { Client as McpClient } from "@modelcontextprotocol/sdk/client/index.js";

export async function prepareToolsForLLM(mcpClient: McpClient) {
  const toolsResult = await mcpClient.listTools();

  const formattedTools = toolsResult.tools.map((tool) => ({
    name: tool.name,
    description: tool.description || `Tool: ${tool.name}`,
    parameters: tool.inputSchema,
    type: tool.type || "function", // Required by the OpenAI module
  }));

  return formattedTools;
}
