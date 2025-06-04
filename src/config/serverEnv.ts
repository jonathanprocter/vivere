const REQUIRED_VARS = ['DATABASE_URL', 'OPENAI_API_KEY'];

REQUIRED_VARS.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
});

export const DATABASE_URL = process.env.DATABASE_URL as string;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
