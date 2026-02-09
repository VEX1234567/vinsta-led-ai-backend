console.log("Server file loaded...");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {

    // ✅ Validate message
    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Message is required." });
    }

    // ✅ Call OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openchat/openchat-7b:free",
        messages: [
          {
            role: "system",
            content: `You are VINSTA LED Lighting Assistant.
Help users choose LED lighting based on their needs.
Recommend bulbs, panels, strip lights, industrial lighting and outdoor lighting.
Keep answers simple and friendly.`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    // ✅ Handle OpenRouter API errors
    if (!response.ok) {
      console.error("OpenRouter API Error:", data);
      return res.status(500).json({
        reply: "AI service error. Please try again later."
      });
    }

    // ✅ Safe response extraction
    const replyText =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.json({ reply: replyText });

  } catch (error) {
    console.error("FULL SERVER ERROR:", error);
    res.status(500).json({
      reply: "Server error. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log("Server running on port " + PORT)
);









