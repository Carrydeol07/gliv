import React, { useState } from 'react';

interface PersonalNotesPanelProps {
  notesContent: string;
  onSaveNotes: (content: string) => void;
}

export const PersonalNotesPanel: React.FC<PersonalNotesPanelProps> = ({ notesContent, onSaveNotes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(notesContent || '');

  const handleSave = () => {
    onSaveNotes(content);
    setIsEditing(false);
  };

  return (
    <div className="personal-notes-panel panel">
      <h3>Personal Notes</h3>
      
      {isEditing ? (
        <div className="notes-editor">
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)}
            rows={5}
          />
          <div className="actions">
            <button onClick={() => { setContent(notesContent || ''); setIsEditing(false); }}>Cancel</button>
            <button className="primary-button" onClick={handleSave}>Save</button>
          </div>
        </div>
      ) : (
        <div className="notes-display">
          {notesContent ? (
            <p>{notesContent}</p>
          ) : (
            <p className="empty-state">No notes added yet.</p>
          )}
          <button onClick={() => setIsEditing(true)}>Edit Notes</button>
        </div>
      )}
    </div>
  );
};
