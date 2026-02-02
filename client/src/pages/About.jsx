import { Code } from 'lucide-react';

export default function About() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '80px 20px',
      }}
    >
      <div style={{ width: '960px', maxWidth: '100%' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Code style={{ width: 32, height: 32, color: 'rgb(168, 85, 247)' }} />
            <h1
              style={{
                fontFamily: 'Inter Variable, Inter, sans-serif',
                fontSize: '48px',
                fontWeight: 700,
                letterSpacing: '-0.05em',
                color: 'rgb(255, 255, 255)',
                margin: 0,
              }}
            >
              Using Dev Helper AI via the CLI
            </h1>
          </div>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'rgb(119, 119, 119)',
              lineHeight: '1.6',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            The Dev Helper CLI is a powerful command-line assistant designed to help developers debug,
            explain, fix, and generate code more efficiently. Once installed, you can use it from any terminal window.
          </p>
        </div>

        {/* Installation Section */}
        <div
          style={{
            backgroundColor: '#0d0d0d',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontFamily: 'Inter Variable, Inter, sans-serif',
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'rgb(255, 255, 255)',
              marginBottom: '16px',
            }}
          >
            📦 Installation
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: 'rgb(200, 200, 200)',
              marginBottom: '12px',
            }}
          >
            To install the CLI globally:
          </p>
          <pre
            style={{
              backgroundColor: 'rgb(9, 9, 11)',
              color: 'rgb(74, 222, 128)',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'monospace',
              overflowX: 'auto',
              border: '1px solid rgb(39, 39, 42)',
            }}
          >
            npm install -g @mattgraba/dev-helper
          </pre>
        </div>

        {/* Authentication Section */}
        <div
          style={{
            backgroundColor: '#0d0d0d',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontFamily: 'Inter Variable, Inter, sans-serif',
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'rgb(255, 255, 255)',
              marginBottom: '16px',
            }}
          >
            🔐 Authentication
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: 'rgb(200, 200, 200)',
              marginBottom: '12px',
            }}
          >
            After installing, login with your Dev Helper account credentials:
          </p>
          <pre
            style={{
              backgroundColor: 'rgb(9, 9, 11)',
              color: 'rgb(74, 222, 128)',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'monospace',
              overflowX: 'auto',
              border: '1px solid rgb(39, 39, 42)',
            }}
          >
            dev-helper login
          </pre>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: 'rgb(119, 119, 119)',
              marginTop: '12px',
            }}
          >
            Your JWT will be securely saved locally at <code style={{ backgroundColor: 'rgb(39, 39, 42)', padding: '2px 6px', borderRadius: '4px' }}>~/.dev-helper/config.json</code>.
          </p>
        </div>

        {/* CLI Commands Section */}
        <div
          style={{
            backgroundColor: '#0d0d0d',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontFamily: 'Inter Variable, Inter, sans-serif',
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'rgb(255, 255, 255)',
              marginBottom: '24px',
            }}
          >
            💡 Available Commands
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <CommandItem
              title="analyze"
              desc="Analyze an error or bug in a code file."
              example="dev-helper analyze -f ./path/to/file.js -l javascript"
            />
            <CommandItem
              title="explain"
              desc="Explain what a piece of code does in plain English."
              example="dev-helper explain -f ./utils/helper.py -l python"
            />
            <CommandItem
              title="fix"
              desc="Suggest a fix for a broken code snippet."
              example="dev-helper fix -f ./src/component.tsx -l typescript"
            />
            <CommandItem
              title="generate"
              desc="Generate boilerplate code from a natural language description."
              example='dev-helper generate -d "Create a React button component"'
            />
            <CommandItem
              title="scaffold"
              desc="Scaffold a React component with best practices."
              example="dev-helper scaffold -n UserProfile"
            />
            <CommandItem
              title="terminal"
              desc="Get terminal commands to accomplish a goal."
              example='dev-helper terminal -g "Set up a Node.js project with TypeScript"'
            />
            <CommandItem
              title="history"
              desc="View your past queries and responses."
              example="dev-helper history"
            />
          </div>
        </div>

        {/* Tips and Best Practices Section */}
        <div
          style={{
            backgroundColor: '#0d0d0d',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontFamily: 'Inter Variable, Inter, sans-serif',
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'rgb(255, 255, 255)',
              marginBottom: '16px',
            }}
          >
            ✨ Tips & Best Practices
          </h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: 'rgb(200, 200, 200)', fontSize: '16px', lineHeight: '1.8' }}>
            <li>Use <code style={{ backgroundColor: 'rgb(39, 39, 42)', padding: '2px 6px', borderRadius: '4px', color: 'rgb(74, 222, 128)' }}>--context</code> flag to include surrounding project files for better analysis.</li>
            <li>Keep file inputs under 100KB — large files may be truncated.</li>
            <li>Use <code style={{ backgroundColor: 'rgb(39, 39, 42)', padding: '2px 6px', borderRadius: '4px', color: 'rgb(74, 222, 128)' }}>--help</code> with any command to see all available options.</li>
            <li>Login uses the same credentials as the web app — register on the website first.</li>
            <li>Your token is saved locally and expires after 7 days.</li>
          </ul>
        </div>

        {/* Footer Note */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '80px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgb(119, 119, 119)',
          }}
        >
          For more examples, contribute to the open-source project, or report bugs, visit the{' '}
          <a
            href="https://github.com/mattgraba/dev-helper-ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgb(168, 85, 247)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
            onMouseOver={(e) => {
              e.target.style.textDecoration = 'underline';
            }}
            onMouseOut={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            GitHub Repository →
          </a>
        </div>
      </div>
    </div>
  );
}

function CommandItem({ title, desc, example }) {
  return (
    <div>
      <h3
        style={{
          fontFamily: 'Inter Variable, Inter, sans-serif',
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'rgb(255, 255, 255)',
          marginBottom: '8px',
        }}
      >
        • {title}
      </h3>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: 'rgb(161, 161, 170)',
          marginBottom: '8px',
          marginLeft: '16px',
        }}
      >
        {desc}
      </p>
      <pre
        style={{
          backgroundColor: 'rgb(9, 9, 11)',
          color: 'rgb(74, 222, 128)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          fontFamily: 'monospace',
          overflowX: 'auto',
          border: '1px solid rgb(39, 39, 42)',
          marginLeft: '16px',
        }}
      >
        {example}
      </pre>
    </div>
  );
}
