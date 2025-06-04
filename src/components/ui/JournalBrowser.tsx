import React, { useState, useEffect } from 'react';
import Button from './Button';

interface JournalEntry {
  id: string;
  timestamp: string;
  transcript: string;
  moodTags: string[];
  summary: string;
}

interface JournalBrowserProps {
  entries?: JournalEntry[];
  isLoading?: boolean;
  onEntrySelect?: (entryId: string) => void;
}

const JournalBrowser: React.FC<JournalBrowserProps> = ({
  entries = [],
  isLoading = false,
  onEntrySelect,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('date');
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  
  useEffect(() => {
    setFilteredEntries(entries);
  }, [entries]);
  
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    
    // In a real implementation, we would apply actual filtering logic
    // For now, we'll just use the same entries
    setFilteredEntries(entries);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const getMoodEmoji = (moods: string[]) => {
    const moodToEmoji: Record<string, string> = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'calm': '😌',
      'anxious': '😰',
      'excited': '😃',
      'reflective': '🤔',
      'hopeful': '🙏',
    };
    
    if (moods.length === 0) return '😐';
    
    // Return emoji for first mood
    const primaryMood = moods[0];
    return moodToEmoji[primaryMood] || '😐';
  };
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Journal Entries</h2>
        
        <div className="flex space-x-4 mb-6">
          <Button 
            variant={selectedFilter === 'date' ? 'primary' : 'secondary'}
            onClick={() => handleFilterChange('date')}
          >
            By Date
          </Button>
          <Button 
            variant={selectedFilter === 'mood' ? 'primary' : 'secondary'}
            onClick={() => handleFilterChange('mood')}
          >
            By Mood
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No journal entries yet. Start recording your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div 
              key={entry.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onEntrySelect && onEntrySelect(entry.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    {formatDate(entry.timestamp)}
                  </div>
                  <p className="line-clamp-2 text-gray-700">
                    {entry.transcript.substring(0, 150)}...
                  </p>
                </div>
                <div className="text-2xl ml-4">
                  {getMoodEmoji(entry.moodTags)}
                </div>
              </div>
              
              {entry.summary && (
                <div className="mt-2 text-sm text-gray-600 italic">
                  {entry.summary}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalBrowser;
