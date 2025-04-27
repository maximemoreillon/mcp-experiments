import { ResponseInput } from "openai/resources/responses/responses";
import { LLMClient } from "./llmClient";
import { client as mcpClient, transport } from "./mcpClient";
import { processLLMResponse } from "./response";
import { prepareToolsForLLM } from "./tools";

// REF: https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md#context-management-and-re-injection
async function main() {
  const messages: ResponseInput = [{ role: "user", content: "What is 3 + 4?" }];

  await mcpClient.connect(transport);
  const llmClient = new LLMClient();

  const formattedTools = await prepareToolsForLLM(mcpClient);

  const llmResponse = await llmClient.sendMessage(messages, {
    tools: formattedTools,
  });

  processLLMResponse(mcpClient, llmClient, llmResponse, messages);
}

main();
