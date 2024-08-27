import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(1); // Only one note per page
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get('/api/notes', {
        params: {
          page: currentPage,
          size: pageSize,
          search: searchQuery
        }
      });
      setNotes(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('There was an error fetching the notes!', error);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleContentChange = (content) => {
    setNewNote(content);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/api/notes', { title: newTitle, content: newNote, status: newStatus });
      fetchNotes();
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
      fetchNotes();
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

  const handleEditContentChange = (content) => {
    setEditContent(content);
  };

  const handleEditStatusChange = (event) => {
    setEditStatus(event.target.value);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/notes/${editingNote.id}`, { title: editTitle, content: editContent, status: editStatus });
      fetchNotes();
      setEditingNote(null);
      setEditTitle('');
      setEditContent('');
      setEditStatus('');
    } catch (error) {
      console.error('There was an error updating the note!', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(0);
    fetchNotes();
  };

  const handlePrint = (noteId) => {
    const printUrl = `/notes/${noteId}/print`;
    const printWindow = window.open(printUrl, '_blank');
    printWindow.focus();
  };

  return (
    <div className="App">
      <h1>Notes</h1>

      {!editingNote && (
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search notes"
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      )}

      {!editingNote && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>Next</button>
        </div>
      )}

      {!editingNote && (
        <ul>
          {notes.map(note => (
            <li key={note.id}>
              <h3>{note.title}</h3>
              <div className="preserve-whitespace" dangerouslySetInnerHTML={{ __html: note.content }} />
              <p>Created: {formatDate(note.dateCreated)}</p>
              <p>Last Updated: {formatDate(note.lastUpdated)}</p>
              <p>Status: {note.status}</p>
              <button onClick={() => handleEditClick(note)}>Edit</button>
              <button onClick={() => handleDelete(note.id)}>Delete</button>
              <button onClick={() => handlePrint(note.id)}>Print</button>
            </li>
          ))}
        </ul>
      )}

      {!editingNote && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>Next</button>
        </div>
      )}

      {!editingNote && (
        <form onSubmit={handleFormSubmit}>
          <h2>New Note</h2>
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            placeholder="Enter a title"
            required
          />
          <ReactQuill
            value={newNote}
            onChange={handleContentChange}
            placeholder="Enter a new note"
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
          <h2>Edit Note</h2>
          <input
            type="text"
            value={editTitle}
            onChange={handleEditTitleChange}
            placeholder="Edit title"
            required
          />
          <ReactQuill
            value={editContent}
            onChange={handleEditContentChange}
            placeholder="Edit note content"
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
