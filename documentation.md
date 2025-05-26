# Vivere Application Documentation

## Overview

Vivere is an AI-powered journaling web application that allows users to record their daily thoughts using voice input, which is then converted to text using transcription. Each journal entry is saved with associated metadata like timestamp, detected mood, and emotion-based summary.

## Architecture

### Tech Stack

- **Frontend**: React with Next.js
- **Backend**: Node.js with Express
- **Database**: SQLite with Prisma ORM
- **AI Integration**: OpenAI API (Whisper for transcription, GPT for analysis)

### Project Structure

```
vivere/
├── prisma/                  # Prisma ORM configuration and schema
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── pages/               # API routes
│   │   └── api/             # Backend API endpoints
│   └── styles/              # Global styles
├── .env                     # Environment variables
└── package.json             # Project dependencies
```

## Database Schema

The application uses Prisma ORM with SQLite. The schema includes:

### User Model
- `id`: UUID (primary key)
- `email`: String (optional, unique)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `settings`: JSON string for user preferences

### JournalEntry Model
- `id`: UUID (primary key)
- `userId`: UUID (foreign key)
- `audioFilePath`: String (location of saved audio file)
- `transcript`: Text (full text transcription)
- `timestamp`: Timestamp
- `moodTags`: JSON Array (detected emotions)
- `summary`: Text (AI-generated summary)
- `embedding`: JSON string (vector embedding for semantic search)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Insight Model
- `id`: UUID (primary key)
- `userId`: UUID (foreign key)
- `type`: String (daily/weekly)
- `content`: Text (AI-generated insights)
- `periodStart`: Timestamp
- `periodEnd`: Timestamp
- `createdAt`: Timestamp

## Frontend Components

### Layout Components

#### MainLayout
The main layout wrapper that includes the header and sidebar.

#### Header
The application header with the app title and tagline.

#### Sidebar
Navigation sidebar with links to all main sections of the application.

### UI Components

#### VoiceRecorder
Handles voice recording using the browser's native MediaRecorder API. Features include:
- Start/stop recording controls
- Audio visualization during recording
- Recording timer
- Playback of recorded audio

#### JournalBrowser
Displays journal entries with filtering options:
- Date-based filtering
- Mood-based filtering
- Entry preview with mood emoji
- Summary display

#### SemanticSearch
Allows users to search their journal using natural language:
- Natural language query input
- Suggested questions
- Results display with relevance scores

#### ExportOptions
Provides options to export journal entries:
- PDF export
- Text export
- Export status indication

#### PrivacySettings
Configures privacy options:
- Voice PIN setup
- Fingerprint authentication setup (simulated)
- Settings persistence

## Backend API Endpoints

### `/api/transcribe`
- **Method**: POST
- **Purpose**: Upload audio and get transcription
- **Parameters**: audioFile, userId
- **Returns**: Transcribed text, detected emotions, summary

### `/api/analyze-emotions`
- **Method**: POST
- **Purpose**: Analyze transcript for emotions
- **Parameters**: transcript, entryId
- **Returns**: Detected emotions with intensity scores

### `/api/semantic-search`
- **Method**: POST
- **Purpose**: Search journal entries with natural language
- **Parameters**: query, userId
- **Returns**: Relevant journal entries with relevance scores

### `/api/export`
- **Method**: GET
- **Purpose**: Export journal entries as PDF or text
- **Parameters**: userId, format
- **Returns**: PDF or text file download

## AI Integration

### Transcription
Uses OpenAI Whisper API to convert audio recordings to text.

### Emotion Analysis
Analyzes transcribed text to detect emotions and their intensities, mapping them to appropriate emojis.

### Semantic Search
Generates vector embeddings for journal entries and queries, enabling semantic similarity search.

### Insights Generation
Analyzes journal entries over time to generate emotional trends and personalized insights.

## User Flows

### Recording a Journal Entry
1. User navigates to "Start Journal"
2. User records audio using the VoiceRecorder component
3. Audio is sent to the server for transcription
4. Transcript is analyzed for emotions
5. Journal entry is saved with metadata
6. User is redirected to view the entry

### Browsing Journal Entries
1. User navigates to "Past Journals"
2. Entries are displayed in the JournalBrowser component
3. User can filter by date or mood
4. User can select an entry to view details

### Asking Questions to Journal
1. User navigates to "Ask My Journal"
2. User enters a natural language query
3. Query is processed for semantic search
4. Relevant entries are displayed with relevance scores

### Viewing Insights
1. User navigates to "Insights"
2. Weekly and monthly emotional trends are displayed
3. AI-generated insights based on journal entries are shown

### Exporting Journal
1. User navigates to "Settings"
2. User selects export format (PDF or text)
3. Journal entries are compiled and formatted
4. File is downloaded to user's device

### Configuring Privacy
1. User navigates to "Settings"
2. User configures voice PIN or fingerprint authentication
3. Settings are saved to user profile

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY="your-openai-api-key"
   ```
4. Generate Prisma client: `npx prisma generate`
5. Create database and run migrations: `npx prisma migrate dev`
6. Start the development server: `npm run dev`

## Deployment

The application can be deployed to any hosting platform that supports Next.js applications, such as Vercel, Netlify, or a custom server.

## Future Enhancements

- Real-time transcription as the user speaks
- Enhanced voice emotion analysis
- More sophisticated AI image generation based on journal content
- Integration with calendar and other productivity tools
- Mobile app versions for iOS and Android
