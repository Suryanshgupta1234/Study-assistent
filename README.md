# Study Assistant

A **plain JavaScript React** app that turns free-form notes into interactive flashcards and quizzes. The AI returns structured JSON (not chat text), which the app validates and renders as stateful UI.

## Features

- **Home page** — product landing with how-it-works and feature highlights
- **Dashboard** — saved study packs, stats, quiz scores, open/delete sessions
- **Create** — paste notes, generate a study pack via Groq API
- **Study mode** — flashcards (flip + keyboard), quiz, re-test wrong answers
- Robust error handling: malformed JSON, wrong shape, timeouts, stale requests
- Mobile-responsive layout with dark mode (system preference)
- Sessions saved in `localStorage`

## Quick start

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com/)

### Setup

```bash
cd study-assistant
npm install
```

Create `server/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Run

```bash
npm start
```

- **Client:** http://localhost:5173
- **API:** http://localhost:3001

## Project structure

```
study-assistant/
├── client/src/
│   ├── components/
│   │   ├── HomePage.jsx      # Landing page
│   │   ├── Dashboard.jsx     # Saved packs & stats
│   │   ├── CreateScreen.jsx  # Notes input + generate
│   │   ├── FlashcardDeck.jsx
│   │   ├── QuizMode.jsx
│   │   ├── StudyOverview.jsx
│   │   └── Navbar.jsx
│   ├── hooks/useStudyGenerator.js
│   ├── api/generateStudyPack.js
│   └── utils/               # sessions, validation (Zod)
├── server/src/
│   ├── routes/generate.js   # POST /api/generate
│   ├── services/llm.js      # Groq integration
│   └── utils/parseJson.js   # Malformed JSON recovery
└── package.json             # npm start runs both
```

## Why plain JavaScript?

The entire codebase uses **`.jsx` / `.js`** — no TypeScript. This keeps the project easy to read, explain in an interview, and extend live without type-system overhead. Zod is still used for runtime validation of AI output (same idea as TypeScript, but at runtime).

## How AI integration works

1. User submits notes from the Create page.
2. Client POSTs to `/api/generate` (proxied through Vite to Express).
3. Server calls Groq with a JSON schema prompt and `response_format: json_object`.
4. Server tries direct parse, code-fence extraction, and JSON repair.
5. Zod validates shape on server and client.
6. Client renders flashcards and quiz — never raw model text.

## Failure handling

| Failure | Behavior |
|---------|----------|
| Malformed JSON | Server extraction/repair; 422 + retry |
| Wrong schema | Zod error shown with retry |
| Empty response | Error message, no crash |
| Timeout (45s) | Retry offered |
| Stale responses | `AbortController` + request ID guard |
| Network error | Error card with message |

## AI usage note

Cursor was used to scaffold components, draft the README, and speed up boilerplate. Architecture (page routing, dashboard stats, error handling, validation pipeline) was designed for the assignment requirements and is explainable in a live interview.

## Known limitations

- Groq free tier rate limits may apply
- Sessions stored locally only (max 10 packs)
- No streaming — waits for full JSON response
- Quiz retest merges answers but doesn't update dashboard score separately

## Time spent

~8 hours

## License

MIT
