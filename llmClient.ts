import { client as mcpClient, transport } from "./mcpClient";
import { client as openAiClient } from "./openAi";
// Hypothetical LLM client class (you'll replace this with your actual LLM client)

type Message = any;

type Options = {
  tools?: any;
  tool_choice?: any;
};

// https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md#5-integrating-with-llms
// https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md#complete-llm-application
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

    const { id, type } = output[0];

    if (type === "function_call") {
      const { arguments: args, name, call_id } = output[0];
      return {
        id,
        // role,
        // content,
        // TODO: how to deal with tool calls?
        tool_calls: [
          {
            name,
            arguments: args,
            id: call_id,
          },
        ],
      };
    } else if (type === "message") {
      const { role, content } = output[0];

      return {
        id,
        role,
        content,
        tool_calls: [],
      };
    } else {
      throw new Error("Unhandled response type");
    }
  }
}
