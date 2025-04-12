import { useState } from 'react';

export default function Home() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
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
    } catch (err) {
      setOutput('에러 발생: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Remi's GPT 소설 생성기 📖</h1>

      <div className="w-full max-w-4xl h-[400px] bg-gray-900 border border-gray-700 rounded-lg p-6 overflow-y-auto mb-6">
        <pre className="whitespace-pre-wrap text-lg font-serif">
          {loading ? 'GPT가 소설을 작성 중입니다...' : output || '여기에 소설이 출력됩니다.'}
        </pre>
      </div>

      <div className="w-full max-w-4xl flex gap-2">
        <input
          className="flex-1 p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          placeholder="프롬프트를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          생성하기
        </button>
      </div>
    </div>
  );
}
