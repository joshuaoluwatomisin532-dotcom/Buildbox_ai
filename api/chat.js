export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST for chat requests." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GEMINI_API_KEY." });
  }

  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    if (!messages.length || messages.length > 16) {
      return res.status(400).json({ error: "Send between 1 and 16 messages." });
    }

    const contents = messages.map((message) => {
      const role = message.role === "assistant" ? "model" : "user";
      const content = typeof message.content === "string" ? message.content.slice(0, 6000) : "";
      return { role, parts: [{ text: content }] };
    }).filter((item) => item.parts[0].text.trim());

    if (!contents.length || contents[contents.length - 1].role !== "user") {
      return res.status(400).json({ error: "The latest message must be from the user." });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "You are Buildbox AI, a helpful, honest, friendly assistant. Explain clearly, adapt to the user's level, and never claim to have done actions you have not done. If unsure, say so."
            }]
          },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
        })
      }
    );

    const result = await response.json();
    if (!response.ok) {
      return res.status(502).json({
        error: result?.error?.message || "The AI provider returned an error."
      });
    }

    const reply = result?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) return res.status(502).json({ error: "The AI returned an empty response." });
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Server error while contacting the AI provider." });
  }
        }
