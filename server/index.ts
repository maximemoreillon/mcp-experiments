import express from "express";
import { mcpHandler } from "./mcp-server";

const app = express();
app.use(express.json());

app.post("/mcp", mcpHandler);

app.listen(3000, () => {
  console.log("MCP server listening on port :3000");
});
