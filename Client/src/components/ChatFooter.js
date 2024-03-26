import React, { useState } from 'react';
import checkPageStatus from "../utils/functions"; // Importación de una función de utilidad

const ChatFooter = ({ socket }) => {
    // Estado local para almacenar el mensaje
    const [message, setMessage] = useState("");

    // Función para emitir evento de escritura al escribir en el campo de mensaje
    const handleTyping = () => socket.emit("typing", `${localStorage.getItem("userName")} Escribiendo`);

    // Función para enviar el mensaje al presionar el botón "SEND"
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && localStorage.getItem("userName")) {
            // Envío del mensaje al servidor con información de texto, nombre, ID, hora y fecha
            socket.emit("message", {
                text: message,
                name: localStorage.getItem("userName"),
                id: `${socket.id}${Math.random()}`,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                date: new Date(Date.now()).toLocaleDateString()
            });
            // Llamada a una función para verificar el estado de la página
            checkPageStatus(message, localStorage.getItem("userName"));
        }
        setMessage(""); // Limpiar el campo de mensaje después de enviar
    }

    return (
        <div className='chat__footer'>
            <form className='form' onSubmit={handleSendMessage}>
                <input 
                    type="text" 
                    placeholder='Write message' 
                    className='message' 
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleTyping} // Evento de escritura al presionar una tecla
                />
                <button className="sendBtn">SEND</button>
            </form>
        </div>
    );
}

export default ChatFooter;