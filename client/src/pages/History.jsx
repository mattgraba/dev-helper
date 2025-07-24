import { ClockIcon } from "lucide-react";

export default function HistoryPage() {
    return (
      <div className="max-w-3xl mx-auto mt-10 space-y-6">
        <h1 className="text-2xl font-bold mb-4">📜 AI Response History</h1>
        <p>You'll fetch and display history entries here!</p>
        <div className="bg-zinc-900/80 rounded-xl p-6 shadow border border-zinc-800 hover:shadow-lg transition">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {timestamp}
          </span>
        </div>
      </div>
    );
  }
  