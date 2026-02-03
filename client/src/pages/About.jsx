import { Code, Key, User, Zap } from 'lucide-react';

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
              Using Dev Helper via the CLI
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
            The Dev Helper CLI is a free, open-source command-line assistant designed to help developers debug,
            explain, fix, and generate code more efficiently. Use your own OpenAI key or the hosted service.
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
             Installation
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

        {/* Getting Started - Two Options */}
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
            Getting Started
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: 'rgb(200, 200, 200)',
              marginBottom: '24px',
            }}
          >
            Choose how you want to use Dev Helper:
          </p>

          {/* Two columns for options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Option A: BYOK */}
            <div
              style={{
                backgroundColor: 'rgb(9, 9, 11)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgb(168, 85, 247)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Key style={{ width: 20, height: 20, color: 'rgb(168, 85, 247)' }} />
                <h3
                  style={{
                    fontFamily: 'Inter Variable, Inter, sans-serif',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'rgb(255, 255, 255)',
                    margin: 0,
                  }}
                >
                  Option A: Use Your Own Key
                </h3>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  color: 'rgb(168, 85, 247)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                RECOMMENDED
              </div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgb(161, 161, 170)',
                  marginBottom: '16px',
                  lineHeight: '1.6',
                }}
              >
                Use your own OpenAI API key. No account required. Calls go directly to OpenAI — complete privacy, you control costs.
              </p>
              <pre
                style={{
                  backgroundColor: 'rgb(0, 0, 0)',
                  color: 'rgb(74, 222, 128)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  border: '1px solid rgb(39, 39, 42)',
                  marginBottom: '12px',
                }}
              >
{`# Set your OpenAI API key
dev-helper config set-key sk-your-key

# Start using immediately
dev-helper analyze -f ./file.js`}
              </pre>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: 'rgb(119, 119, 119)',
                }}
              >
                Key stored locally at <code style={{ backgroundColor: 'rgb(39, 39, 42)', padding: '2px 6px', borderRadius: '4px' }}>~/.dev-helper/config.json</code>
              </p>
            </div>

            {/* Option B: Hosted Service */}
            <div
              style={{
                backgroundColor: 'rgb(9, 9, 11)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgb(39, 39, 42)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <User style={{ width: 20, height: 20, color: 'rgb(74, 222, 128)' }} />
                <h3
                  style={{
                    fontFamily: 'Inter Variable, Inter, sans-serif',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'rgb(255, 255, 255)',
                    margin: 0,
                  }}
                >
                  Option B: Hosted Service
                </h3>
              </div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgb(161, 161, 170)',
                  marginBottom: '16px',
                  lineHeight: '1.6',
                  marginTop: '38px',
                }}
              >
                Create an account and use the managed service. No API key management required. History syncs to web UI.
              </p>
              <pre
                style={{
                  backgroundColor: 'rgb(0, 0, 0)',
                  color: 'rgb(74, 222, 128)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  border: '1px solid rgb(39, 39, 42)',
                  marginBottom: '12px',
                }}
              >
{`# Login with your account
dev-helper login

# Start using
dev-helper analyze -f ./file.js`}
              </pre>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: 'rgb(119, 119, 119)',
                }}
              >
                <a href="/register" style={{ color: 'rgb(168, 85, 247)', textDecoration: 'none' }}>Create an account</a> first, then login via CLI.
              </p>
            </div>
          </div>
        </div>

        {/* Config Command Section */}
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
            Managing Your Configuration
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: 'rgb(200, 200, 200)',
              marginBottom: '20px',
            }}
          >
            Use the <code style={{ backgroundColor: 'rgb(39, 39, 42)', padding: '2px 6px', borderRadius: '4px', color: 'rgb(74, 222, 128)' }}>config</code> command to manage your setup:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ConfigCommandItem
              command="dev-helper config"
              desc="Show current configuration and mode"
            />
            <ConfigCommandItem
              command="dev-helper config set-key <api-key>"
              desc="Set your OpenAI API key (enables BYOK mode)"
            />
            <ConfigCommandItem
              command="dev-helper config remove-key"
              desc="Remove your stored API key"
            />
            <ConfigCommandItem
              command="dev-helper config show"
              desc="Display detailed configuration info"
            />
          </div>
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
             Available Commands
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

        {/* Comparison Table */}
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
            Usage Modes Comparison
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgb(39, 39, 42)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: 'rgb(161, 161, 170)', fontWeight: 500 }}>Feature</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: 'rgb(168, 85, 247)', fontWeight: 600 }}>BYOK Mode</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: 'rgb(74, 222, 128)', fontWeight: 600 }}>Hosted Service</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow feature="Account required" byok="No" hosted="Yes" />
                <ComparisonRow feature="OpenAI key required" byok="Yes (yours)" hosted="No" />
                <ComparisonRow feature="API costs" byok="You pay OpenAI" hosted="Included" />
                <ComparisonRow feature="Privacy" byok="Keys stay local" hosted="Keys on server" />
                <ComparisonRow feature="History sync" byok="Local only" hosted="Server + Web UI" />
                <ComparisonRow feature="Setup time" byok="Instant" hosted="Create account" />
              </tbody>
            </table>
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
             Best Practices
          </h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: 'rgb(200, 200, 200)', fontSize: '16px', lineHeight: '1.8' }}>
            <li>Use <code style={{ backgroundColor: 'rgb(39, 39, 42)', padding: '2px 6px', borderRadius: '4px', color: 'rgb(74, 222, 128)' }}>--context</code> flag to include surrounding project files for better analysis.</li>
            <li>Keep file inputs under 100KB — large files may be truncated.</li>
            <li>Use <code style={{ backgroundColor: 'rgb(39, 39, 42)', padding: '2px 6px', borderRadius: '4px', color: 'rgb(74, 222, 128)' }}>--help</code> with any command to see all available options.</li>
            <li>For BYOK mode, you can also set <code style={{ backgroundColor: 'rgb(39, 39, 42)', padding: '2px 6px', borderRadius: '4px', color: 'rgb(74, 222, 128)' }}>OPENAI_API_KEY</code> as an environment variable.</li>
            <li>Run <code style={{ backgroundColor: 'rgb(39, 39, 42)', padding: '2px 6px', borderRadius: '4px', color: 'rgb(74, 222, 128)' }}>dev-helper config</code> to check your current setup and mode.</li>
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
          Dev Helper is free and open-source. For more examples, contribute, or report bugs, visit the{' '}
          <a
            href="https://github.com/mattgraba/dev-helper"
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

function ConfigCommandItem({ command, desc }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <pre
        style={{
          backgroundColor: 'rgb(9, 9, 11)',
          color: 'rgb(74, 222, 128)',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '13px',
          fontFamily: 'monospace',
          overflowX: 'auto',
          border: '1px solid rgb(39, 39, 42)',
          margin: 0,
        }}
      >
        {command}
      </pre>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgb(161, 161, 170)',
          margin: '4px 0 0 8px',
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function ComparisonRow({ feature, byok, hosted }) {
  return (
    <tr style={{ borderBottom: '1px solid rgb(39, 39, 42)' }}>
      <td style={{ padding: '12px 16px', color: 'rgb(200, 200, 200)' }}>{feature}</td>
      <td style={{ padding: '12px 16px', color: 'rgb(255, 255, 255)' }}>{byok}</td>
      <td style={{ padding: '12px 16px', color: 'rgb(255, 255, 255)' }}>{hosted}</td>
    </tr>
  );
}
