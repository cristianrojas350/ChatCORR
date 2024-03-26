import React, { useEffect, useState, useRef } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatPage = ({ socket }) => { 
  // Estado local para almacenar mensajes y estado de escritura
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  
  // Referencia al último mensaje para scroll automático
  const lastMessageRef = useRef(null);
  
  // Efecto para recibir mensajes nuevos del servidor
  useEffect(() => {
    socket.on("messageResponse", data => setMessages([...messages, data]));
  }, [socket, messages]);
  
  // Efecto para cargar mensajes iniciales al montar el componente
  useEffect(() => {
    function fetchMessages() {
      fetch("http://localhost:4000/api")
        .then(response => response.json())
        .then(data => setMessages(data.messages));
    }
    fetchMessages();
  }, []);
  
  // Efecto para recibir estado de escritura de otros usuarios
  useEffect(() => {
    socket.on("typingResponse", data => setTypingStatus(data));
  }, [socket]);
  
  // Efecto para hacer scroll automático al último mensaje
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className='chat__main'>
        <ChatBody messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
}

export default ChatPage;