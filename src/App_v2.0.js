import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('There was an error fetching the notes!', error);
    }
  };

  const handleInputChange = (event) => {
    setNewNote(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/notes', { content: newNote });
      setNotes([...notes, response.data]);
      setNewNote('');
    } catch (error) {
      console.error('There was an error creating the note!', error);
    }
  };

  return (
    <div className="App">
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={newNote}
          onChange={handleInputChange}
          placeholder="Enter a new note"
        />
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
}

export default App;
