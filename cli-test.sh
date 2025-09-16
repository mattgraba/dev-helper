#!/bin/bash

echo "📦 Running Dev Helper CLI Test Suite..."

USER_ID="matt123"

# Login without prompt
echo "🔐 Testing login..."
printf "$USER_ID\n" | dev-helper login
if [ $? -ne 0 ]; then echo "❌ Login failed"; exit 1; fi
echo "✅ Login passed"

echo "=== Compliance Project Tests ==="

# Analyze single audit log
echo "-> Testing compliance analyze-audit"
if dev-helper compliance analyze-audit tests/sample-audit.json > /tmp/compliance-output.json; then
  if grep -q "summary" /tmp/compliance-output.json && grep -q "complianceGate" /tmp/compliance-output.json; then
    echo -e "\033[0;32m[PASS]\033[0m compliance analyze-audit returned enriched log"
  else
    echo -e "\033[0;31m[FAIL]\033[0m compliance analyze-audit missing expected fields"
    cat /tmp/compliance-output.json
  fi
else
  echo -e "\033[0;31m[FAIL]\033[0m compliance analyze-audit command failed to run"
fi

# Analyze
echo "🔍 Testing analyze..."
dev-helper analyze -f ./tests/sample-bug.js -l javascript
if [ $? -ne 0 ]; then echo "❌ Analyze failed"; exit 1; fi
echo "✅ Analyze passed"

# Explain
echo "📖 Testing explain..."
dev-helper explain -f ./tests/sample-bug.js -l javascript
if [ $? -ne 0 ]; then echo "❌ Explain failed"; exit 1; fi
echo "✅ Explain passed"

# Fix
echo "🔧 Testing fix..."
dev-helper fix -f ./tests/sample-bug.js -l javascript --output ./tests/fixed-output.js
if [ ! -f ./tests/fixed-output.js ]; then echo "❌ Fix output file not created"; exit 1; fi
echo "✅ Fix passed"

# Generate
echo "🛠️ Testing generate..."
dev-helper generate -d "Create a basic Express server" --output ./tests/generated-server.js
if [ ! -f ./tests/generated-server.js ]; then echo "❌ Generate output file not created"; exit 1; fi
echo "✅ Generate passed"

# Scaffold
echo "🏗️ Testing scaffold..."
dev-helper scaffold -n TestComponent --output ./tests/ScaffoldedTestComponent.js
if [ ! -f ./tests/ScaffoldedTestComponent.js ]; then echo "❌ Scaffold output file not created"; exit 1; fi
echo "✅ Scaffold passed"

# Terminal
echo "💻 Testing terminal..."
dev-helper terminal -g "Install dependencies for a React app"
if [ $? -ne 0 ]; then echo "❌ Terminal failed"; exit 1; fi
echo "✅ Terminal passed"

# History
echo "🕓 Testing history..."
dev-helper history
if [ $? -ne 0 ]; then echo "❌ History failed"; exit 1; fi
echo "✅ History passed"

echo "🎉 All CLI tests completed successfully!"
