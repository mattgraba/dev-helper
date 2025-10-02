# Dev Helper Overview 🚀

## 🎯 Purpose
Dev Helper is a **full-stack AI-powered developer assistant** that integrates directly into the developer workflow. It enables engineers to **analyze, explain, fix, and generate code** from the CLI, while also offering a **web frontend** for authentication, error submission, and history browsing.

This project exists to reduce debugging friction, streamline common developer tasks, and provide a **project-aware AI layer** that feels native to development environments.

Unlike IDE-integrated AI assistants (e.g. Cursor, Copilot), Dev Helper is not designed to silently generate code in the background. Instead, it emphasizes **intentional, educational, and structured usage**.

---

## 🧭 Core Philosophy
Dev Helper is built on four guiding pillars:

1. **Empowering Intentional Usage**  
   Every command is explicit (`analyze`, `fix`, `generate`, `explain`) — nothing runs passively in the background. The developer chooses when and how to engage AI.

2. **Promoting Critical Thinking**  
   Rather than spitting out opaque completions, Dev Helper provides explanations, context, and a history trail. Users stay engaged with the *why* behind the code.

3. **Augmenting Fundamentals**  
   Dev Helper reduces the friction of trial-and-error debugging while reinforcing programming, OS, and system fundamentals. It helps engineers learn faster, not bypass the learning.

4. **Resisting "Vibe-Coding"**  
   Unlike auto-complete driven IDEs, Dev Helper discourages mindless paste-and-run behavior. It supports structured problem-solving and intentional engineering practice.

> **Core belief:** *AI should accelerate engineering growth, not enable shortcuts that erode critical thinking.*

---

## 🧩 Problem Statement
Developers waste significant time switching between:
- Debugging tools, docs, and search engines
- Local code vs. external AI assistants
- Repeated manual fixes with little historical tracking
This results in **context-switch fatigue** and **lost productivity**

---

## 💡 Solution
Dev Helper provides:
- **Modular CLI Commands** (analyze, explain, fix, generate, scaffold, terminal)
- **Project-Aware Analysis** (via `--context` file scanning)
- **Persistent History** stored in a database for review
- **Web Dashboard** for login, error submission, and browsing results
- **Secure Authentication** via JWT, shared between CLI and web frontend

---

## 📦 MVP Scope
1. **CLI Tool** published to npm (`@mattgraba/dev-helper`)
2 **Express Backend** for AI requests + history storage
3. **MongoDB Databse** for presistence
4. **JWT Authentication** for multi-user accounts
5. **React Frontend** for login, input form, and history browsing

---

## 🚧 Current State
- ✅ CLI: core commands implemented (analyze, explain, fix, generate, scaffold, history, login)
- ✅ Backend: Express API with OpenAI integration + MongoDB storage
- 🔄 In Progress: JWT authentication across CLI + backend + frontend
- 🔄 In Progress: Frontend scaffolding with protected routes
- 📌 Planned: History filtering, pagination, search

---

## 🔮 Future Vision
- **Full SaaS Dashboard** with role-based access (RBAC)
- **Advanced Querying** (search, filters, tags for AI responses)
- **Team/Org Mode** for shared usage across developers
- **Context-Aware AI Improvements** (dynamic prompt trimming, repo-wide context awareness)
- **Deployment**: Vercel (frontend) + Render/Heroku (backend) + Mongo Atlas (DB)

---

## 📚 Related Docs

- [System Architecture](../architecture/Architecture.md)
- [Core Concepts](../concepts/CoreConcepts.md)
- [API Reference](../reference/api/)


