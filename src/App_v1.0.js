import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Fetch notes from the backend API
    axios.get('/api/notes')
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the notes!', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
