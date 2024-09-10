import React from 'react';

const MessageBubble = ({ message, isSentByUser }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isSentByUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem'
    }}>
      <div style={{
        maxWidth: '60%',
        padding: '0.5rem',
        borderRadius: '1rem',
        backgroundColor: isSentByUser ? '#DCF8C6' : '#FFF',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        color: '#333',
        fontSize: '1rem',
        wordWrap: 'break-word',
      }}>
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;
