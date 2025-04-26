import { Client as McpClient } from "@modelcontextprotocol/sdk/client/index.js";
import { LLMClient } from "./llmClient";

//REF: https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md#handling-tool-execution-and-results
export async function processLLMResponse(
  mcpClient: McpClient,
  llmClient: LLMClient,
  llmResponse,
  messages
) {
  // Check if the LLM wants to call a tool
  // This detection logic will depend on your LLM provider's response format
  if (llmResponse.tool_calls && llmResponse.tool_calls.length > 0) {
    console.log("LLM response has tool calls");
    // Process each tool call

    for (const toolCall of llmResponse.tool_calls) {
      const { name, arguments: args, id } = toolCall;

      console.log(`LLM wants to call tool: ${name}`);
      console.log("Tool arguments:", args);

      // Optionally get user approval
      const userApproved = await getUserApproval(name, args);

      if (userApproved) {
        try {
          // Call the tool using MCP
          const toolResult = await mcpClient.callTool({
            name,
            arguments: JSON.parse(args),
          });

          // Add the tool call to the message history
          // TODO: is this needed?
          // messages.push({
          //   role: "assistant",
          //   content: null, // PROBLEM: this cannot be null
          //   tool_calls: [{ id, name, arguments: args }],
          // });

          // Add the tool result to the message history
          // TODO: Stuff had to be removed here
          messages.push({
            role: "assistant", // Invalid value: 'tool'. Supported values are: 'assistant', 'system', 'developer', and 'user'.
            content: toolResult.isError
              ? `Error: ${toolResult.content[0].text}`
              : toolResult.content[0].text,
            // tool_call_id: id, // 400 Unknown parameter: 'input[1].tool_call_id'
          });

          console.log("Made it until here!!");
        } catch (error) {
          console.error(`Error calling tool ${name}:`, error);

          // Add error information to the message history
          messages.push({
            role: "tool",
            tool_call_id: id,
            content: `Error executing tool ${name}: ${error.message}`,
          });
        }
      } else {
        // User didn't approve the tool call
        messages.push({
          role: "system",
          content: `Tool call to ${name} was not approved by the user.`,
        });
      }
    }

    // Send the updated conversation back to the LLM
    const newResponse = await llmClient.sendMessage(messages);

    // Recursively process the new response (which might contain more tool calls)
    return processLLMResponse(mcpClient, llmClient, newResponse, messages);
  }

  // If no tool calls, just return the LLM response
  return { llmResponse, messages };
}

// Helper function to get user approval for tool calls
async function getUserApproval(toolName: string, args) {
  // In a real application, you would show a UI dialog or prompt
  // For this example, we'll simulate user approval
  return new Promise((resolve) => {
    console.log(`Approve tool call to ${toolName}?`);
    console.log("Arguments:", JSON.stringify(args, null, 2));
    console.log('Type "y" to approve, anything else to deny:');

    process.stdin.once("data", (data) => {
      const input = data.toString().trim().toLowerCase();
      resolve(input === "y");
    });
  });
}
