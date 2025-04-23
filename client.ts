import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = "http://127.0.0.1:3000/mcp";

const baseUrl = new URL(url);

async function main() {
  const client = new Client({
    name: "streamable-http-client",
    version: "1.0.0",
  });
  const transport = new StreamableHTTPClientTransport(new URL(baseUrl));
  await client.connect(transport);
  console.log("Connected using Streamable HTTP transport");

  // const prompt = await client.getPrompt({
  //   name: "echo",
  //   arguments: {
  //     message: "This is my message",
  //   },
  // });

  // console.log(prompt);

  const resource = await client.readResource({
    uri: "echo://hello",
  });

  console.log(resource);
}

main();
