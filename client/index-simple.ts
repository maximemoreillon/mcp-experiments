import type { ResponseInput } from "openai/resources/responses/responses.mjs";
import { client as mcpClient, transport } from "./mcpClient";
import { client as llmClient } from "./openAi";

// REF: https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md#context-management-and-re-injection

const model = "gpt-4o-mini";

await mcpClient.connect(transport);

const toolsResult = await mcpClient.listTools();

const { contents: inviteesResourceContents } = await mcpClient.readResource({
  name: "invitees",
  uri: "invitees://list",
});

const instructions = `
  You are a helpful assistant that answers questions based on a given context.
  The context is a set of MCP resources.
  Current context:
  ${JSON.stringify(inviteesResourceContents)}
  `;

const tools = toolsResult.tools.map((tool) => ({
  name: tool.name,
  description: tool.description || `Tool: ${tool.name}`, // NOTE: tools do not seem to have a description
  parameters: tool.inputSchema,
  type: tool.type || "function", // Required by the OpenAI module
}));

// const input: ResponseInput = [{ role: "user", content: "What is 4 + 8" }];
const input: ResponseInput = [
  {
    role: "user",
    content:
      "Tell me if Alec Trevelyan is invited to the party. Invite him if ihe is not",
  },
];

// throw "BANANA";
const { output } = await llmClient.responses.create({
  model,
  instructions,
  input,
  tools,
});

console.log(output[0]);

// throw "Banana";

if (output[0].type !== "function_call") throw Error("Not a function call");

const { arguments: args, name, call_id } = output[0];

input.push({
  call_id,
  type: "function_call",
  name,
  arguments: args,
});

const { content } = await mcpClient.callTool({
  name,
  arguments: JSON.parse(args),
});

input.push({ type: "function_call_output", call_id, output: content[0].text });

console.log(instructions);

const { output: output2 } = await llmClient.responses.create({
  model,
  instructions,
  input,
});

console.log(JSON.stringify(output2, null, 2));
