import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const invitees = ["John Doe", "Jane Smith"];
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

  server.tool("invite", { name: z.string() }, async ({ name }) => {
    invitees.push(name);
    console.log({ invitees });
    return {
      content: [{ type: "text", text: `${name} was invited` }],
    };
  });

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

  server.resource("invitees", "invitees://list", async (uri, {}) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(invitees),
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
