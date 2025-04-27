import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function getServer() {
  const server = new McpServer({
    name: "Echo",
    version: "1.0.0",
  });

  server.tool("echo", { message: z.string() }, async ({ message }) => ({
    content: [{ type: "text", text: `Tool echo: ${message}` }],
  }));

  server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  }));

  server.resource(
    "echo",
    new ResourceTemplate("echo://{message}", { list: undefined }),
    async (uri, { message }) => ({
      contents: [
        {
          uri: uri.href,
          text: `Resource echo: ${message}`,
        },
      ],
    })
  );

  // TODO: figure out the right way to write uris
  server.resource("invitees", "invitees://", async (uri, {}) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(["John Doe", "Jane Smith"]),
      },
    ],
  }));

  server.prompt("echo", { message: z.string() }, ({ message }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Please process this message: ${message}`,
        },
      },
    ],
  }));

  return server;
}
