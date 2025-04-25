import { client as mcpClient, transport } from "./mcpClient";
import { client as openAiClient } from "./openAi";
// Hypothetical LLM client class (you'll replace this with your actual LLM client)

type Message = {
  content: string;
};

type Options = {
  tools?: any;
  tool_choice?: any;
};

// https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md#5-integrating-with-llms

export class LLMClient {
  // TODO: fing out what to do with options

  async sendMessage(messages: Message[], options: Options = {}) {
    // TODO: How to deal with message array?

    const { tools, tool_choice } = options;

    const { output } = await openAiClient.responses.create({
      model: "gpt-4o",
      instructions: "You are a helpful assistant",
      input: messages,
      tools,
      tool_choice,
    });

    const { id, arguments: args, name } = output[0];

    // TODO: how to get from "completion to the following return?"

    return {
      id,
      // role,
      // content,
      // TODO: how to deal with tool calls?
      tool_calls: [{ name, arguments: args }], // Will contain tool call requests if any
    };
  }
}

export async function setupLLMWithMCP() {
  // Set up MCP client

  await mcpClient.connect(transport);
  // await mcpClient.initialize();

  // Set up LLM client
  const llmClient = new LLMClient();

  return { mcpClient, llmClient };
}
