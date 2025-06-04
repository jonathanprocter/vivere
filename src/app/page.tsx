import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import VoiceRecorder from '../components/ui/VoiceRecorder';
import JournalBrowser from '../components/ui/JournalBrowser';

export default function Home() {
  // Mock data for demonstration
  const recentEntries = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      transcript: 'Today was a productive day. I managed to complete most of my tasks and felt a sense of accomplishment. The weather was nice, which helped my mood.',
      moodTags: ['happy', 'productive'],
      summary: 'A productive day with a positive outlook.'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      transcript: 'I felt a bit anxious today about the upcoming presentation. I spent some time preparing and practicing, which helped reduce my nervousness.',
      moodTags: ['anxious', 'reflective'],
      summary: 'Anxiety about presentation, but preparation helped.'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      transcript: 'Had a relaxing day today. Went for a walk in the park and read a book. The peaceful environment helped me clear my mind.',
      moodTags: ['calm', 'peaceful'],
      summary: 'A relaxing day spent in nature and reading.'
    }
  ];

  const handleRecordingComplete = (audioBlob: Blob) => {
    console.log('Recording completed:', audioBlob);
    // In a real implementation, this would upload the audio and request transcription
  };

  const handleEntrySelect = (entryId: string) => {
    console.log('Selected entry:', entryId);
    // In a real implementation, this would navigate to the entry detail page
  };

  return (
    <MainLayout activePage="dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Welcome to Vivere</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Start a New Journal Entry</h2>
            <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Weekly Insights</h2>
            <p className="text-gray-700">
              This week, you've been mostly feeling <span className="font-semibold text-primary">calm</span> and <span className="font-semibold text-primary">reflective</span>.
            </p>
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <div className="w-1/4 text-sm">Calm</div>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-1/4 text-sm">Reflective</div>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-1/4 text-sm">Happy</div>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4 text-sm">Anxious</div>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Journal Entries</h2>
          <JournalBrowser 
            entries={recentEntries} 
            onEntrySelect={handleEntrySelect} 
          />
        </div>
      </div>
    </MainLayout>
  );
}
