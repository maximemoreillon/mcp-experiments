import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const baseUrl = new URL("http://127.0.0.1:3000/mcp");

export const client = new Client({
  name: "streamable-http-client",
  version: "1.0.0",
});

export const transport = new StreamableHTTPClientTransport(new URL(baseUrl));

// if (process.argv[1] === import.meta.filename) {
//   async function main() {
//     await client.connect(transport);
//     const result = await client.callTool({
//       name: "echo",
//       arguments: { message: "world" },
//     });

//     console.log(result);
//   }

//   main();
// }
