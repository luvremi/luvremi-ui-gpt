import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [summary, setSummary] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setOutput(data.result);
      setSummary(data.summary);
      setHistory(prev => [{ input, result: data.result, summary: data.summary }, ...prev]);
    } catch (err) {
      setOutput('❌ 오류: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-4">Remi's GPT 소설 생성기 📖</h1>

      <textarea
        placeholder="프롬프트 입력..."
        className="w-full border rounded p-3 mb-2"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleGenerate} className="px-4 py-2 bg-blue-500 text-white rounded">
        생성하기
      </button>

      {loading && <p className="mt-4">⏳ GPT가 소설을 생성 중입니다...</p>}

      {output && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">📘 생성된 소설</h2>
          <div className="border p-4 bg-gray-100 whitespace-pre-wrap">{output}</div>

          <h3 className="text-lg font-medium mt-4">📝 요약</h3>
          <div className="p-2 bg-yellow-100 border">{summary}</div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold">📚 이전 생성 기록</h2>
          <ul className="mt-2 space-y-2">
            {history.map((h, idx) => (
              <li key={idx} className="border p-3 bg-white shadow-sm">
                <strong>프롬프트:</strong> {h.input}
                <br />
                <strong>요약:</strong> {h.summary}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
