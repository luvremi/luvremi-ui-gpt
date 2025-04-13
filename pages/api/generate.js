export async function onRequestPost(context) {
  try {
    const { input } = await context.request.json();

    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`,
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

    const data = await completion.json();
    return new Response(JSON.stringify({ result: data.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
