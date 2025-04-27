// https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md#accessing-resources
import { Client as McpClient } from "@modelcontextprotocol/sdk/client/index.js";
import { client as mcpClient, transport } from "./mcpClient";

// if (process.argv[1] === import.meta.filename) {
//   async function main() {
//     await mcpClient.connect(transport);
//     const result = await mcpClient.listResources();
//     const [resource] = result.resources;

//     const contentResult = await mcpClient.readResource(resource);
//     console.log(contentResult);
//   }
//   main();
// }
