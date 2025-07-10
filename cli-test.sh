#!/bin/bash

echo "📦 Running Dev Helper CLI Test Suite..."

# Ensure token is set
echo "🔐 Testing login..."
dev-helper login
if [ $? -ne 0 ]; then echo "❌ Login failed"; exit 1; fi
echo "✅ Login passed"

# Test analyze
echo "🔍 Testing analyze..."
echo "[DEBUG] Running: dev-helper analyze -f ./tests/sample-bug.js -l javascript"
dev-helper analyze -f ./tests/sample-bug.js -l javascript
echo "[DEBUG] Analyze finished"
if [ $? -ne 0 ]; then echo "❌ Analyze failed"; exit 1; fi
echo "✅ Analyze passed"


# Test explain
echo "📖 Testing explain..."
dev-helper explain -f ./tests/sample-bug.js -l javascript
if [ $? -ne 0 ]; then echo "❌ Explain failed"; exit 1; fi
echo "✅ Explain passed"

# Test fix
echo "🔧 Testing fix..."
dev-helper fix -f ./tests/sample-bug.js -l javascript --output ./tests/fixed-output.js
if [ ! -f ./tests/fixed-output.js ]; then echo "❌ Fix output file not created"; exit 1; fi
echo "✅ Fix passed"

# Test generate
echo "🛠️ Testing generate..."
dev-helper generate -d "Create a basic Express server" --output ./tests/generated-server.js
if [ ! -f ./tests/generated-server.js ]; then echo "❌ Generate output file not created"; exit 1; fi
echo "✅ Generate passed"

# Test scaffold
echo "🏗️ Testing scaffold..."
dev-helper scaffold -n TestComponent --output ./tests/ScaffoldedTestComponent.js
if [ ! -f ./tests/ScaffoldedTestComponent.js ]; then echo "❌ Scaffold output file not created"; exit 1; fi
echo "✅ Scaffold passed"

# Test terminal
echo "💻 Testing terminal..."
dev-helper terminal -g "Install dependencies for a React app"
if [ $? -ne 0 ]; then echo "❌ Terminal failed"; exit 1; fi
echo "✅ Terminal passed"

# Test history
echo "🕓 Testing history..."
dev-helper history
if [ $? -ne 0 ]; then echo "❌ History failed"; exit 1; fi
echo "✅ History passed"

echo "🎉 All CLI tests completed successfully!"
