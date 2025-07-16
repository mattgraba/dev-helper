import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      <section className="text-center space-y-2">
        <h1 className="text-4xl font-bold">🚀 Dev Helper AI</h1>
        <p className="text-lg text-gray-600">Your AI-powered assistant for debugging and code analysis.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">What is it?</h2>
        <p className="text-gray-700">
          Dev Helper AI helps developers analyze error messages and generate solutions using natural language AI.
          You can use it via our CLI tool or this web interface.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">CLI vs Web</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li><strong>CLI:</strong> Ideal for fast in-terminal analysis during development</li>
          <li><strong>Web:</strong> Great for reviewing history, logging in, and visually exploring fixes</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Explore</h2>
        <div className="space-x-4">
          <a href="https://github.com/mattgraba/dev-helper-ai" target="_blank" className="text-blue-500 underline">GitHub Source</a>
          <a href="https://mattgraba.com" target="_blank" className="text-blue-500 underline">About Me</a>
        </div>
      </section>

      <div className="text-center">
        <Link to="/login">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login to Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
