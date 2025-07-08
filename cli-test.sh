#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

CONFIG_FILE="$HOME/.dev-helper/config.json"
TEST_FILE="./tests/sample-bug.js"
SCAFFOLDED_FILE="./client/components/TestComponent.jsx"

function print_pass() {
  echo -e "${GREEN}✅ $1 passed${NC}"
}

function print_fail() {
  echo -e "${RED}❌ $1 failed${NC}"
}

echo "📦 Running Dev Helper CLI Test Suite..."

# ----------------------
# 1. Login
# ----------------------
echo -n "Enter test user ID for login: "
read TEST_USER_ID
dev-helper login <<< "$TEST_USER_ID"
sleep 1

if [ -f "$CONFIG_FILE" ]; then
  print_pass "Login"
else
  print_fail "Login (token not saved)"
  exit 1
fi

# ----------------------
# 2. Generate
# ----------------------
dev-helper generate --description "Create a simple Express server"
if [ $? -eq 0 ]; then
  print_pass "Generate"
else
  print_fail "Generate"
fi

# ----------------------
# 3. Scaffold
# ----------------------
dev-helper scaffold -n TestComponent -o $SCAFFOLDED_FILE
if [ -f "$SCAFFOLDED_FILE" ]; then
  print_pass "Scaffold"
else
  print_fail "Scaffold (file not written)"
fi

# ----------------------
# 4. Analyze
# ----------------------
dev-helper analyze --filePath "$TEST_FILE"
if [ $? -eq 0 ]; then
  print_pass "Analyze"
else
  print_fail "Analyze"
fi

# ----------------------
# 5. Explain
# ----------------------
dev-helper explain --filePath "$TEST_FILE"
if [ $? -eq 0 ]; then
  print_pass "Explain"
else
  print_fail "Explain"
fi

# ----------------------
# 6. Fix
# ----------------------
dev-helper fix --filePath "$TEST_FILE"
if [ $? -eq 0 ]; then
  print_pass "Fix"
else
  print_fail "Fix"
fi

# ----------------------
# 7. Terminal
# ----------------------
dev-helper terminal --goal "Set up a React project with Tailwind"
if [ $? -eq 0 ]; then
  print_pass "Terminal"
else
  print_fail "Terminal"
fi

# ----------------------
# 8. History
# ----------------------
dev-helper history
if [ $? -eq 0 ]; then
  print_pass "History"
else
  print_fail "History"
fi

echo -e "\n🧪 ${GREEN}CLI system test complete.${NC}"
