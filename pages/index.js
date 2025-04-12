import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      const rawData = await res.text();
      const data = isJson ? JSON.parse(rawData) : { error: rawData };

      if (res.ok) {
        setOutput(data.result);
        setSummary(data.summary || '');
        setHistory((prev) => [...prev, { input, result: data.result, summary: data.summary }]);
      } else {
        setOutput('❌ 오류: ' + (data.error || '응답 에러'));
      }
    } catch (err) {
      setOutput('에러 발생: ' + err.message);
    }

    setLoading(false);
  };

  const handleLoad = (item) => {
    setInput(item.input);
    setOutput(item.result);
    setSummary(item.summary || '');
  };

  const handleDelete = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6 flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col lg:mr-6">
        <h1 className="text-2xl font-bold mb-4">Remi's GPT 소설 생성기 📖</h1>

        <div className="h-[300px] bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-y-auto mb-4">
          <pre className="whitespace-pre-wrap font-serif text-lg">
            {loading ? 'GPT가 소설을 작성 중입니다...' : output || '여기에 소설이 출력됩니다.'}
          </pre>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">🧠 요약</h2>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{summary}</p>
        </div>

        <div className="flex gap-2">
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

      <div className="w-full lg:w-[300px] mt-10 lg:mt-0">
        <h2 className="text-lg font-semibold mb-2">📚 생성 내역</h2>
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li
              key={index}
              className="bg-gray-800 p-3 rounded flex justify-between items-start text-sm"
            >
              <button onClick={() => handleLoad(item)} className="text-left text-white flex-1 hover:underline">
                {item.input.slice(0, 30)}...
              </button>
              <button onClick={() => handleDelete(index)} className="text-red-400 ml-2">🗑</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
