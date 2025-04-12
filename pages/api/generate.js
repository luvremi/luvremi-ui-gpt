export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 메서드입니다.' });
  }

  const { input } = req.body;

  try {
    // 🧠 1차 요청 - 소설 생성
    const storyRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "당신은 감각적인 소설 작가입니다." },
          { role: "user", content: input },
        ],
        temperature: 0.8,
      }),
    });

    const storyText = await storyRes.text();
    if (!storyRes.ok) {
      throw new Error("소설 생성 실패: " + storyText);
    }

    const storyData = JSON.parse(storyText);
    const story = storyData.choices?.[0]?.message?.content || "⚠️ 응답 없음";

    // ✨ 2차 요청 - 요약 생성
    const summaryRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "당신은 문학 요약가입니다. 아래 글을 2~3줄로 요약하세요." },
          { role: "user", content: story },
        ],
        temperature: 0.6,
      }),
    });

    const summaryText = await summaryRes.text();
    if (!summaryRes.ok) {
      throw new Error("요약 생성 실패: " + summaryText);
    }

    const summaryData = JSON.parse(summaryText);
    const summary = summaryData.choices?.[0]?.message?.content || "⚠️ 요약 없음";

    return res.status(200).json({ result: story, summary });
  } catch (err) {
    console.error("[API 오류]", err);
    return res.status(500).json({ error: err.message });
  }
}
