import { Card, CardContent } from '@/components/ui/card';
import { Code } from 'lucide-react';

export default function about() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
        <Code className="w-8 h-8 text-indigo-400" />
        Using Dev Helper AI via the CLI
      </h1>

      <p className="text-gray-300 mb-8 text-lg">
        The Dev Helper CLI is a powerful command-line assistant designed to help developers debug,
        explain, fix, and generate code more efficiently. Once installed, you can use it from any terminal window.
      </p>

      {/* Installation */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-2">📦 Installation</h2>
          <p className="text-gray-300 mb-2">To install the CLI globally:</p>
          <pre className="bg-zinc-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
            npm install -g dev-helper
          </pre>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-2">🔐 Authentication</h2>
          <p className="text-gray-300 mb-2">
            After installing, login to authenticate and receive your access token:
          </p>
          <pre className="bg-zinc-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
            dev-helper login
          </pre>
          <p className="text-gray-400 mt-2 text-sm">
            Your JWT will be securely saved locally at <code>~/.dev-helper/config.json</code>.
          </p>
        </CardContent>
      </Card>

      {/* CLI Commands */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">💡 Available Commands</h2>
          <div className="space-y-4">
            <CommandItem
              title="analyze"
              desc="Analyze an error or bug in a code file."
              example="dev-helper analyze ./path/to/file.js"
            />
            <CommandItem
              title="explain"
              desc="Explain what a piece of code does in plain English."
              example="dev-helper explain ./utils/complexFunction.py"
            />
            <CommandItem
              title="fix"
              desc="Suggest a fix for a broken code snippet."
              example="dev-helper fix ./src/failingComponent.tsx"
            />
            <CommandItem
              title="generate"
              desc="Generate boilerplate code (e.g. a React component or Express route)."
              example="dev-helper generate react-component Button"
            />
            <CommandItem
              title="history"
              desc="View your past queries and responses (requires login)."
              example="dev-helper history"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tips and Techniques */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Tips & Best Practices</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Use the CLI in the root of your project for better context parsing.</li>
            <li>Keep file inputs small — large files may be truncated.</li>
            <li>Use <code>--help</code> with any command to get inline usage info.</li>
            <li>Use descriptive file names to improve AI understanding.</li>
            <li>Run <code>dev-helper login</code> before accessing history or making authenticated requests.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Final Note */}
      <div className="text-gray-400 text-sm mt-10">
        For more examples, contribute to the open-source project, or report bugs, visit the{' '}
        <a
          href="https://github.com/your-username/dev-helper-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          GitHub Repository →
        </a>
      </div>
    </section>
  );
}

function CommandItem({ title, desc, example }) {
  return (
    <div>
      <h3 className="text-white font-medium text-lg">{`• ${title}`}</h3>
      <p className="text-gray-400 ml-4">{desc}</p>
      <pre className="bg-zinc-900 text-green-400 p-3 mt-1 ml-4 rounded text-sm overflow-x-auto">
        {example}
      </pre>
    </div>
  );
}
