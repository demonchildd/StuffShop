import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useConnectSocket } from '../../features/api/useConnectSocket';
import SocketApi from '../../features/api/socket-api';
import styles from "../../styles/Chat.module.css";

const Chat = () => {
    
    const [text, setText] = useState("");
    const { currentUser } = useSelector(({user}) => user)
    const {message} = useConnectSocket();
    const [messages, setMessages] = useState([]);
  
    
    useEffect(() => {
        setMessages(prevMessages => [...prevMessages, message]);
    }, [message]);

    const sendMessage = () => {
        if(text != '')
        {
            SocketApi.socket?.emit("server-path",currentUser.name + ": " +  text);
            setText('');
        }
    };
    return (
        <section className={styles.body}>
            <div className={styles.chat}>
                {messages.slice().reverse().map((msg, index) => (
                    <p style={{wordBreak: "break-all"}} key={index}>{msg}</p>
                ))}
            </div>
            
            <div className={styles.group}>
                <input type="text" placeholder={"type something..."} value={text} onChange={(e) => setText(e.target.value)}/>
                
                <button onClick={sendMessage}>Send</button>
            </div>
            
            
            
        </section>
    );
}

export default Chat;