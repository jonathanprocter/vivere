import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '../../config/serverEnv';

const prisma = new PrismaClient();

// Initialize OpenAI API with mock key
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Emotion detection and tagging service
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transcript, entryId } = req.body;

    if (!transcript || !entryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real implementation, we would:
    // 1. Send the transcript to OpenAI API for emotion analysis
    // 2. Process the response to extract emotions and their intensities
    // 3. Map emotions to appropriate emojis
    // 4. Update the journal entry with the detected emotions

    // Mock implementation for demonstration
    const emotions = analyzeEmotions(transcript);
    const moodTags = JSON.stringify(emotions.map(e => e.emotion));
    
    // Update journal entry with detected emotions
    const updatedEntry = await prisma.journalEntry.update({
      where: { id: entryId },
      data: { moodTags },
    });

    return res.status(200).json({
      success: true,
      data: {
        emotions,
        entry: updatedEntry,
      },
    });
  } catch (error) {
    console.error('Error analyzing emotions:', error);
    return res.status(500).json({ error: 'Failed to analyze emotions' });
  }
}

// Mock emotion analysis function
function analyzeEmotions(text: string) {
  // This is a simplified mock implementation
  // In a real app, this would use NLP or the OpenAI API
  
  const emotionKeywords: Record<string, string[]> = {
    'happy': ['happy', 'joy', 'excited', 'great', 'wonderful', 'fantastic'],
    'sad': ['sad', 'unhappy', 'depressed', 'down', 'blue', 'miserable'],
    'angry': ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated'],
    'calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content'],
    'anxious': ['anxious', 'worried', 'nervous', 'stressed', 'uneasy', 'tense'],
    'reflective': ['thinking', 'reflecting', 'contemplating', 'pondering', 'wondering'],
    'hopeful': ['hope', 'optimistic', 'looking forward', 'positive', 'eager'],
  };
  
  const textLower = text.toLowerCase();
  const detectedEmotions: Array<{emotion: string, intensity: number}> = [];
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    let count = 0;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        count += matches.length;
      }
    });
    
    if (count > 0) {
      detectedEmotions.push({
        emotion,
        intensity: Math.min(count / 2, 1), // Normalize intensity between 0 and 1
      });
    }
  });
  
  // If no emotions detected, default to 'reflective'
  if (detectedEmotions.length === 0) {
    detectedEmotions.push({
      emotion: 'reflective',
      intensity: 0.5,
    });
  }
  
  // Sort by intensity (highest first)
  return detectedEmotions.sort((a, b) => b.intensity - a.intensity);
}
