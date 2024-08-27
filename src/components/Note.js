import React from 'react';
import axios from 'axios';

const Note = ({ note, setNotes }) => {
    const deleteNote = (id) => {
        axios.delete(`/api/notes/${id}`)
            .then(() => {
                setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            })
            .catch(error => {
                console.error('There was an error deleting the note!', error);
            });
    };

    return (
        <div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
    );
};

export default Note;
