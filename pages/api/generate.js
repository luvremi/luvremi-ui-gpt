export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 메서드입니다.' });
  }

  const { input } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "당신은 감각적인 소설 작가입니다." },
          { role: "user", content: input }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
