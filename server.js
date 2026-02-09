console.log("Server file loaded...");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// ⭐ List of models to try (fallback system)
const MODELS = [
  "deepseek/deepseek-chat:free",
  "meta-llama/llama-3-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "openchat/openchat-7b:free",
  "deepseek/deepseek-chat" // Paid fallback (very cheap)

];


// ⭐ Function to try models one by one
async function tryModels(userMessage) {

  for (const model of MODELS) {

    try {

      console.log("Trying model:", model);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: `
You are VINSTA LED Lighting Assistant.
Help users choose LED lighting based on their needs.
Recommend bulbs, panels, strip lights, industrial lighting and outdoor lighting.
Keep answers simple and friendly.
`
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      });

      const data = await response.json();

      if (response.ok && data?.choices?.[0]?.message?.content) {
        console.log("Model success:", model);
        return data.choices[0].message.content;
      }

      console.log("Model failed:", model);

    } catch (err) {
      console.log("Error with model:", model);
    }

  }

  return "AI service temporarily unavailable. Please try again later.";
}


// ⭐ Chat Endpoint
app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Message is required." });
    }

    const reply = await tryModels(userMessage);

    res.json({ reply });

  } catch (error) {
    console.error("FULL SERVER ERROR:", error);
    res.status(500).json({ reply: "Server error occurred." });
  }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log("Server running on port " + PORT)
);









