import React from 'react';
import { useNavigate } from "react-router-dom";

const ChatBody = ({ messages, typingStatus, lastMessageRef }) => { 
  const navigate = useNavigate();

  // Función para salir del chat, limpiar el nombre de usuario y recargar la página
  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    navigate("/");
    window.location.reload(); // Recargar la página al salir del chat
  }

  return (
    <>
      <header className='chat__mainHeader'>
        <p>Chat grupal</p>
        <button className='leaveChat__btn' onClick={handleLeaveChat}>Salir</button>
      </header>
      <div className='message__container'>
        {messages.map((message, i) => {
          return (
            <span key={i}>
              <div className="message__chats">
                <p className={message.name === localStorage.getItem("userName") ? 'sender__name' : ''}>{message.name}</p>
                <div className={message.name === localStorage.getItem("userName") ? 'message__sender' : 'message__recipient'}>
                  <p>{message.text}</p>
                  <p style={{ textAlign: 'right', fontSize: 'small' }}>{message.time}</p>
                  <p style={{ textAlign: 'right', fontSize: 'small' }}>{message.date}</p>
                </div>
              </div>
            </span>
          )
        })}
        <div className='message__status'>
          <p>{typingStatus}</p> {/* Mostrar el estado de escritura de otros usuarios */}
        </div>
        <div ref={lastMessageRef} /> {/* Referencia al último mensaje para scroll automático */}
      </div>
    </>
  )
}

export default ChatBody;