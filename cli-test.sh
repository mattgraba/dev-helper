#!/bin/bash

echo "📦 Running Dev Helper CLI Test Suite..."

USER_ID="matt123"

# Login without prompt
echo "🔐 Testing login..."
printf "$USER_ID\n" | dev-helper login
if [ $? -ne 0 ]; then echo "❌ Login failed"; exit 1; fi
echo "✅ Login passed"

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
