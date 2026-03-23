# LinkedIn Speak

LinkedIn Speak is a small React + TypeScript app that turns raw achievement notes into polished LinkedIn-ready captions using the Groq API.

## Stack

- React + TypeScript + Vite
- Tailwind CSS with shadcn-style UI primitives
- Express backend for secure Groq API calls
- No database

## Setup

1. Copy `.env.example` to `.env`
2. Add your Groq API key
3. Install dependencies
4. Run the app

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and the API runs on `http://localhost:3001`.

## Environment Variables

```bash
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
PORT=3001
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
VITE_API_BASE_URL=http://localhost:3001
```

- `CORS_ORIGINS`: comma-separated list of allowed frontend origins for the backend API.
- `VITE_API_BASE_URL`: base URL used by the frontend when calling the backend API.
