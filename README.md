# Vivere

**remember to live**

Vivere is an AI-powered journaling application that lets you capture daily thoughts using voice. Recordings are transcribed and analyzed for mood, then stored with summaries so you can search and reflect on how you felt over time.

## Features

- Voice recording with transcription
- View past entries sorted by date and mood
- Ask questions using semantic search
- Receive weekly or daily emotional insights
- Export entries as PDF or text
- Optional privacy mode with voice PIN or fingerprint

## Tech Stack

- React with Next.js for the frontend
- Node.js/Express backend
- SQLite with Prisma ORM
- OpenAI Whisper and GPT for AI services

## Project Structure
```
vivere/
├── prisma/                  # Prisma schema
├── src/                     # Next.js app and components
├── .env                     # Environment variables
└── package.json             # Project dependencies
```

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY="your-openai-api-key"
   ```
4. Generate Prisma client: `npx prisma generate`
5. Run migrations: `npx prisma migrate dev`
6. Start the dev server: `npm run dev`

Use `npm run build` to create a production build and `npm run lint` to check code style.

See `documentation.md` for more details about the architecture and future enhancements.
