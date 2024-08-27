import React, { useState } from 'react';
import axios from 'axios';

const NoteForm = ({ setNotes }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/notes', { title, content })
            .then(response => {
                setNotes(prevNotes => [...prevNotes, response.data]);
                setTitle('');
                setContent('');
            })
            .catch(error => {
                console.error('There was an error creating the note!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Add Note</button>
        </form>
    );
};

export default NoteForm;
