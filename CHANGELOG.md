## v1.2.0 – 2026-02-17

### Added
- Structured boxed output for `analyze` command with numbered issues, line references, and suggestions
- JSON-based AI response parsing with graceful fallback

### Changed
- Analyze prompt now requests structured JSON for reliable formatting
- Server `/analyze` endpoint returns `{ issues, suggestion }` instead of `{ explanation, fix }`
- Multi-step spinner feedback during analysis (reading, processing, complete)

---

## v1.1.0 – 2026-02-03

### Added
- Bring Your Own OpenAI API Key (BYOK) support
- `dev-helper config` command for local configuration
- Optional hosted fallback for users without API keys

### Changed
- Authentication is no longer required when using a local API key
