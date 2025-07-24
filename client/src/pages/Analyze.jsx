import { useState } from 'react';
import api from '@/utils/api';
import { WandIcon } from 'lucide-react';

export default function AnalyzePage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse('');
    setLoading(true);

    try {
      const token = localStorage.getItem('dev-helper-token');
      const res = await api.post('/analyze', { input }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full flex justify-center items-center min-h-[80vh] px-4">
      <section className="w-[960px] h-[500px] bg-black/80 border border-zinc-800 rounded-2xl p-8 shadow-xl flex flex-col justify-center">
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight tracking-tight">
            Dev Helper AI
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl">
            AI-powered debugging and productivity assistant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your error message here..."
            className="w-full min-h-[120px] rounded-xl bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-700 px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition resize-y"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-tr from-violet-500 to-cyan-500 text-white font-semibold shadow-md hover:scale-[1.03] hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <WandIcon className="w-5 h-5" />
            Analyze
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {response && (
          <div className="bg-zinc-100 text-zinc-800 mt-6 p-4 rounded-lg shadow-inner max-h-[200px] overflow-y-auto">
            <h2 className="font-semibold mb-2">AI Response:</h2>
            <pre className="whitespace-pre-wrap text-sm">{response}</pre>
          </div>
        )}
      </section>
    </main>
  );
}
