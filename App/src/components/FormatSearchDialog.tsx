import React, { useState } from 'react';

interface FormatSearchDialogProps {
  onSearch: (query: string) => void;
  onCancel: () => void;
  isSearching: boolean;
  searchResults: any[];
  onSelectResult: (result: any) => void;
  onCreateManual: (title: string) => void;
}

export const FormatSearchDialog: React.FC<FormatSearchDialogProps> = ({
  onSearch,
  onCancel,
  isSearching,
  searchResults,
  onSelectResult,
  onCreateManual
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content format-search-dialog">
        <h3>Add Another Format</h3>
        
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder="Search provider for format..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" disabled={isSearching || !query.trim()}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="search-results">
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map(result => (
                <li key={result.providerEntityId} onClick={() => onSelectResult(result)}>
                  <strong>{result.title}</strong> - {result.providerId}
                  <button>Select</button>
                </li>
              ))}
            </ul>
          ) : (
            query && !isSearching && (
              <div className="no-results">
                No results found.
                <button onClick={() => onCreateManual(query)}>Create Manual Format</button>
              </div>
            )
          )}
        </div>

        <div className="dialog-actions">
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
