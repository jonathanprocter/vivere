# Vivere

Vivere is an AI-powered journaling web application. This repository contains a small example Next.js project with Prisma and Tailwind.

## Development

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment variables in a `.env` file. See `.env.example` for required variables.
3. Generate the Prisma client and run migrations
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
4. Start the development server
   ```bash
   npm run dev
   ```

## Deployment

Build the project and start it in production mode:

```bash
npm run build
npm start
```

Deploy to any platform that supports Next.js (e.g. Vercel or Netlify).

### Production Environment Variables

Create a `.env.production` file based on `.env.production.example` with your
production database URL and OpenAI API key. These variables are loaded
automatically during the build and runtime.

### Caching and Asset Optimization

Static assets served from `/_next/static` are cached for one year using
immutable cache headers. API routes send `Cache-Control: no-store` to prevent
caching sensitive data.

### UI/UX Enhancements

A default layout imports global styles and sets metadata for the entire app. A custom 404 page helps users recover from broken links.

