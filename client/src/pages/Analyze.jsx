import { useState } from 'react';
import api from '@/utils/api';

export default function AnalyzePage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse('');

    try {
      const token = localStorage.getItem('dev-helper-token');
      const res = await api.post('/analyze', { input }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze error');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🧠 Analyze an Error</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border p-2 rounded resize-y min-h-[120px]"
          placeholder="Paste your error or issue here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Analyze
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {response && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">AI Response:</h2>
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
}
