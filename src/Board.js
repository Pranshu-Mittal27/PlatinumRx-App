// src/components/Board.js
import React, { useState } from 'react';
import Note from './Note2';
import './styles.css'; // Import styles

const Board = () => {
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: 'This is a New Note',
      x: Math.random() * 500,
      y: Math.random() * 500,
      draggable: true,
      pinned: false,
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (id, newText) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
    console.log('Edited Note:', id, newText);
  };

  const togglePin = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note))
    );
  };

  const handleDragStart = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, draggable: false } : note))
    );
  };

  const handleDragEnd = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, draggable: true } : note))
    );
  };

  const handleDrop = (id, offsetX, offsetY) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, x: offsetX, y: offsetY } : note
      )
    );
  };

  return (
    <div className="board">
      {notes.map((note) => (
        <Note
        key={note.id}
        id={note.id}
        text={note.text}
        x={note.x}
        y={note.y}
        draggable={note.draggable}
        pinned={note.pinned}
        onDelete={() => deleteNote(note.id)}
        onEdit={(id,editedText) => editNote(note.id, editedText)} // Pass both id and editedText
        onPin={() => togglePin(note.id)}
        onDragStart={() => handleDragStart(note.id)}
        onDragEnd={() => handleDragEnd(note.id)}
        onDrop={(x, y) => handleDrop(note.id, x, y)}
      />    
      ))}
      <button style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={addNote}>
        +
      </button>
    </div>
  );
};

export default Board;
