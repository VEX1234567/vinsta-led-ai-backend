console.log("Server file loaded...");
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
  console.error("FULL ERROR:", error);
  res.status(500).json({ error: error.message });
}


});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running on port " + PORT));



