// src/components/Note.js
import React, { useState, useRef, useEffect } from 'react';
import './styles.css'; // Import styles

const Note = ({ id, text, initialX, initialY, draggable, pinned, onDelete, onEdit, onPin }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setDragging] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const noteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, 0);
      }
    }
  }, [isEditing]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - noteRef.current.getBoundingClientRect().width / 2,
          y: e.clientY - noteRef.current.getBoundingClientRect().height / 2,
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setDragging(false);
        // Cleanup event listeners on mouse up
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      // Cleanup event listeners on component unmount
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDragStart = () => {
    // Check if the note is draggable (not pinned) before allowing drag
    if (draggable && !pinned) {
      setDragging(true);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    setEditing(false);
    console.log('Saving:', id, editedText);
    onEdit(id, editedText);
  };

  const handleTextClick = () => {
    // Enable editing when the text is clicked
    setEditing(true);
  
    // Programmatically set the selection range to the beginning of the text
    if (inputRef.current) {
      inputRef.current.setSelectionRange(0, 0);
    }
  };

  return (
    <div
      ref={noteRef}
      className={`note ${pinned ? 'pinned' : ''}`}
      style={{
        left: position.x,
        top: position.y,
      }}
      draggable={false}
      onMouseDown={handleDragStart}
    >
      <div className="content">
        <span onClick={handleTextClick}>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          ) : (
            text
          )}
        </span>
        <button className="delete" onClick={() => onDelete(id)}>x</button>
      </div>
      <div className="actions">
        <button onClick={handleEditClick}>Edit</button>
        <button onClick={() => onPin(id)}>{pinned ? 'Unpin' : 'Pin'}</button>
        {isEditing && <button onClick={handleSaveClick}>Save</button>}
      </div>
    </div>
  );
};

export default Note;
