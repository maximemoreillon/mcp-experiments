import { setupLLMWithMCP } from "./llmClient";
import { processLLMResponse } from "./response";
import { prepareToolsForLLM } from "./tools";

// REF: https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md#context-management-and-re-injection
async function main() {
  const messages = [{ role: "user", content: "What is 3 + 4?" }];

  const { llmClient, mcpClient } = await setupLLMWithMCP();

  const formattedTools = await prepareToolsForLLM(mcpClient);

  // const userQuery = [{ role: "user", content: userPrompt }];

  // const response = await queryLLMWithTools(
  //   llmClient,
  //   formattedTools,
  //   userPrompt
  // );

  const llmResponse = await llmClient.sendMessage(messages, {
    tools: formattedTools,
  });

  processLLMResponse(mcpClient, llmClient, llmResponse, messages);
}

main();
