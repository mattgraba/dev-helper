#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Config paths
CONFIG_DIR="$HOME/.dev-helper"
CONFIG_FILE="$CONFIG_DIR/config.json"

echo -e "${YELLOW}Starting CLI test script...${NC}"

# Test login command
echo -e "\n${YELLOW}Testing login command...${NC}"

# Simulate user input (testUser123)
LOGIN_OUTPUT=$(echo "testUser123" | node cli/cli.js login 2>&1)

if [[ $? -eq 0 && -f "$CONFIG_FILE" ]]; then
  echo -e "${GREEN}✅ Login command ran successfully and token file exists.${NC}"
else
  echo -e "${RED}❌ Login command failed or token file missing.${NC}"
  echo "$LOGIN_OUTPUT"
  exit 1
fi

# Verify token file contents (basic check)
TOKEN_PRESENT=$(jq -r '.token' "$CONFIG_FILE" 2>/dev/null)

if [[ -n "$TOKEN_PRESENT" && "$TOKEN_PRESENT" != "null" ]]; then
  echo -e "${GREEN}✅ Token found in config file.${NC}"
else
  echo -e "${RED}❌ Token missing or invalid in config file.${NC}"
  exit 1
fi

# Test history command
echo -e "\n${YELLOW}Testing history command...${NC}"

HISTORY_OUTPUT=$(node cli/cli.js history 2>&1)

if [[ $? -eq 0 ]]; then
  echo -e "${GREEN}✅ History command ran successfully.${NC}"

  if echo "$HISTORY_OUTPUT" | grep -q "No history found."; then
    echo -e "${YELLOW}⚠️ No history found message displayed (this is OK if no history exists).${NC}"
  elif echo "$HISTORY_OUTPUT" | grep -q "Showing"; then
    echo -e "${GREEN}✅ History output shows saved responses.${NC}"
  else
    echo -e "${RED}❌ Unexpected history output:${NC}"
    echo "$HISTORY_OUTPUT"
  fi
else
  echo -e "${RED}❌ History command failed to run.${NC}"
  echo "$HISTORY_OUTPUT"
  exit 1
fi

# Cleanup test token file
echo -e "\n${YELLOW}Cleaning up test artifacts...${NC}"
rm -f "$CONFIG_FILE"

if [[ ! -f "$CONFIG_FILE" ]]; then
  echo -e "${GREEN}✅ Cleanup successful.${NC}"
else
  echo -e "${RED}❌ Cleanup failed.${NC}"
fi

echo -e "\n${GREEN}All CLI tests completed.${NC}"
