export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 메서드입니다.' });
  }

  const { input } = req.body;

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: '당신은 감각적인 소설 작가입니다.' },
          { role: 'user', content: input }
        ],
        temperature: 0.8
      }),
    });

    const storyData = await completion.json();
    const story = storyData.choices[0].message.content;

    // 요약 생성 요청
    const summaryRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: '당신은 뛰어난 문학 요약가입니다. 소설 내용을 2~3줄로 요약해주세요.' },
          { role: 'user', content: story }
        ],
        temperature: 0.7
      }),
    });

    const summaryData = await summaryRes.json();
    const summary = summaryData.choices[0].message.content;

    return res.status(200).json({ result: story, summary });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
