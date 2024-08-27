import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('There was an error deleting the note!', error);
    }
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleEditChange = (event) => {
    setEditContent(event.target.value);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/notes/${editingNote.id}`, { content: editContent });
      setNotes(notes.map(note => note.id === editingNote.id ? response.data : note));
      setEditingNote(null);
      setEditContent('');
    } catch (error) {
      console.error('There was an error updating the note!', error);
    }
  };

  return (
    <div className="App">
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.content}
            <button onClick={() => handleEditClick(note)}>Edit</button>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
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

      {editingNote && (
        <form onSubmit={handleEditSubmit}>
          <textarea
            value={editContent}
            onChange={handleEditChange}
            placeholder="Edit note content"
            rows="4" // Adjust rows and cols as needed
            cols="50"
          />
          <button type="submit">Update Note</button>
          <button type="button" onClick={() => setEditingNote(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default App;
