CLI: dev-helper analyze error.js
        |
        v
Backend Route (/analyze)
        |
        v
Prompt Builder:
   - Context: code snippet
   - Instruction: "Explain error + provide fix"
        |
        v
OpenAI API
        |
        v
Response Parser:
   - Explanation text
   - Suggested fix
        |
        v
Return to CLI/UI
        |
        v
Saved in History (MongoDB)
