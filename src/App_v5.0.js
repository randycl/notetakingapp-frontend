import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return new Date(dateString).toLocaleString('en-US', options);
}

function App() {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState('Open');
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editStatus, setEditStatus] = useState('');

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

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleInputChange = (event) => {
    setNewNote(event.target.value);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/notes', { title: newTitle, content: newNote, status: newStatus });
      setNotes([...notes, response.data]);
      setNewTitle('');
      setNewNote('');
      setNewStatus('Open');
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
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditStatus(note.status);
  };

  const handleEditTitleChange = (event) => {
    setEditTitle(event.target.value);
  };

  const handleEditChange = (event) => {
    setEditContent(event.target.value);
  };

  const handleEditStatusChange = (event) => {
    setEditStatus(event.target.value);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/notes/${editingNote.id}`, { title: editTitle, content: editContent, status: editStatus });
      setNotes(notes.map(note => note.id === editingNote.id ? response.data : note));
      setEditingNote(null);
      setEditTitle('');
      setEditContent('');
      setEditStatus('');
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
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p><b>Created:</b> {formatDate(note.dateCreated)}</p>
            <p><b>Last Updated:</b> {formatDate(note.lastUpdated)}</p>
            <p><b>Status:</b> {note.status}</p>
            <button onClick={() => handleEditClick(note)}>Edit</button>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {!editingNote && (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            placeholder="Enter a title"
            required
          />
          <textarea
            value={newNote}
            onChange={handleInputChange}
            placeholder="Enter a new note"
            rows="4"
            cols="50"
            required
          />
          <select value={newStatus} onChange={handleStatusChange}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Hold">Hold</option>
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
            <option value="Closed">Closed</option>
          </select>
          <button type="submit">Add Note</button>
        </form>
      )}

      {editingNote && (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editTitle}
            onChange={handleEditTitleChange}
            placeholder="Edit title"
            required
          />
          <textarea
            value={editContent}
            onChange={handleEditChange}
            placeholder="Edit note content"
            rows="4"
            cols="50"
            required
          />
          <select value={editStatus} onChange={handleEditStatusChange}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Hold">Hold</option>
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
            <option value="Closed">Closed</option>
          </select>
          <button type="submit">Update Note</button>
          <button type="button" onClick={() => setEditingNote(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default App;
