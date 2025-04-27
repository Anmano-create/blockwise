import { OPENAI_KEY } from "../../env";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

export const summarise = async (raw) => {
  const chunk = raw.slice(0, 4000); // keep token cost sane
  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant who writes short news digests.",
      },
      {
        role: "user",
        content:
          `Summarise the following article in ONE paragraph (4-5 sentences),` +
          ` clear and neutral, for a 12-year-old reader.\n\n` +
          chunk,
      },
    ],
    max_tokens: 120,
    temperature: 0.4,
  });

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body,
  });

  if (!res.ok) throw new Error("LLM call failed");
  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() ?? "";
};
