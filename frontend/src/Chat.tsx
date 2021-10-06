import React, { useEffect, useState } from 'react'
import ChatForm from './ChatForm';

import useSocket from './useSocket';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ?? ""

export interface ChatProps {
    username: string
}

interface Message {
    id: string
    username: string
    text: string
    postedAt: number
}

function Chat({ username }: ChatProps) {
    const socket = useSocket(apiEndpoint)
    const [messages, setMessages] = useState<Message[]>([])

    const handleMessage = (text: string) => {
        console.log("Emit message", {text, username});
        socket.emit("message", username, text)
    }

    useEffect(() => {
        if (socket === null) {
          return
        }

        socket.on('connect', function() {
            console.log('Connected');
        });

        socket.on('message', (message: Message)=>{
          console.log("Message received", message);
          setMessages(prev => ([...prev, message]))
        });
      
        socket.on('exception', function(data) {
          console.log('event', data);
        });
      
        socket.on('disconnect', function() {
          console.log('Disconnected');
        });
        
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return (
        <div>
            <h2>Hello {username}!</h2>

            <ul>
              {messages.map(({id, username, text, postedAt: _}) => (
                  <li key={id}>
                      {`[${username}]: ${text}`}
                  </li>
              ))}
            </ul>
            
            <ChatForm onMessage={handleMessage} />
        </div>
    )
}

export default Chat 