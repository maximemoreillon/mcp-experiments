import OpenAI from "openai";
import "dotenv/config";

const { OPENAI_API_KEY } = process.env;

if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");

export const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// if (process.argv[1] === import.meta.filename) {
//   async function main() {
//     const { output } = await client.responses.create({
//       model: "gpt-4o",
//       instructions: "You are a coding assistant that talks like a pirate",
//       input: "Are semicolons optional in JavaScript?",
//     });

//     console.log(output);
//   }

//   main();
// }
