import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = "http://127.0.0.1:3000/mcp";

const baseUrl = new URL(url);

async function main() {
  try {
    const client = new Client({
      name: "streamable-http-client",
      version: "1.0.0",
    });
    const transport = new StreamableHTTPClientTransport(new URL(baseUrl));
    await client.connect(transport);
    console.log("Connected using Streamable HTTP transport");
  } catch (error) {
    // If that fails with a 4xx error, try the older SSE transport
    console.log(error);
    console.log("Streamable HTTP connection failed");
  }
}

main();
