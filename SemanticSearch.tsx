import React, { useState } from 'react';
import Button from '../ui/Button';

interface SemanticSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  results?: any[];
}

const SemanticSearch: React.FC<SemanticSearchProps> = ({
  onSearch,
  isLoading = false,
  results = [],
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestions = [
    'What was I feeling last weekend?',
    'When did I last feel happy?',
    'What have I been anxious about recently?',
    'What goals did I mention this month?',
    'How has my mood changed over the past week?'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Ask My Journal</h2>
        <p className="text-gray-600 mb-4">
          Ask questions about your past entries using natural language.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What was I feeling last weekend?"
            className="input flex-grow mr-2"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
      
      <div className="mb-6">
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-primary underline text-sm"
        >
          {showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
        </button>
        
        {showSuggestions && (
          <div className="mt-2 space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Results</h3>
          {results.map((result, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">
                {new Date(result.timestamp).toLocaleDateString()}
              </div>
              <p className="text-gray-700 mb-2">{result.transcript.substring(0, 200)}...</p>
              <div className="text-sm text-primary">
                Relevance: {Math.round(result.relevanceScore * 100)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;
