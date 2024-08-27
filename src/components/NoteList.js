import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './Note';
import NoteForm from './NoteForm';

const NoteList = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        axios.get('/api/notes')
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the notes!', error);
            });
    }, []);

    return (
        <div>
            <h1>Notes</h1>
            <NoteForm setNotes={setNotes} />
            {notes.map(note => (
                <Note key={note.id} note={note} setNotes={setNotes} />
            ))}
        </div>
    );
};

export default NoteList;
