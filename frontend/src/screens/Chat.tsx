import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";

import ChatForm from '../components/ChatForm';
import useSocket from '../hooks/useSocket';
import { ChevronLeftIcon, ChevronRightIcon, LogoutIcon } from '../components/Icons';
import { RootState } from '../state/store';
import { logout } from '../state/authSlice';
import { Message, User } from '../types';
import { useGetAllMessagesQuery } from '../state/messagesApi';
import ChatMessage from '../components/ChatMessage';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ?? ""

function Chat() {
  const { user: currentUser, accessToken } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  if (!(currentUser && accessToken)) {
    dispatch(logout())
    return null
  }

  return <ChatWrapped {...{ currentUser, accessToken }} />
}

function ChatWrapped({currentUser, accessToken}: { currentUser: User, accessToken: string }) {
  const {data: initialMessages, isSuccess} = useGetAllMessagesQuery(undefined)
  const [showSidebar, setShowSidebar] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const dispatch = useDispatch()
  const socket = useSocket(apiEndpoint, {
    query: { accessToken, userId: currentUser.id },
    // use WebSocket first, if available
    transports: ["websocket", "polling"] 
  })
  

  useEffect(() => {
    if (isSuccess && messages.length === 0) {
      setMessages(initialMessages as Message[])
    }
  }, [initialMessages, isSuccess, messages])

  useEffect(() => {
    if (socket === null) {
      return
    }

    socket.on('connect', function () {
      console.log('Connected');
    });

    socket.on('message', (message: Message) => {
      console.log("Message received", message);
      setMessages(prev => ([...prev, message]))
    });

    socket.on('exception', function (data) {
      console.log('event', data);
    });

    socket.on('disconnect', function () {
      console.log('Disconnected');
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMessage = (text: string) => {
    console.log("Emit message", { text, user: currentUser.id });
    socket.emit("message", currentUser.id, text)
  }

  const openSidebar = () => setShowSidebar(true)
  const closeSidebar = () => setShowSidebar(false)
  const handleLogout = () => dispatch(logout())

  return (
    <div className="flex-1 flex">
      <aside className={`bg-gray-800 text-white ${showSidebar ? "w-60" : "w-15"}`}>
        <div className={`flex justify-between items-center py-3 px-3`}>
          {showSidebar ? (
            <>
              <div className="font-bold text-lg tracking-wide">
                Chat app
              </div>
              <button className="pointer" onClick={closeSidebar}>
                <ChevronLeftIcon />
              </button>
            </>
          ) : (
            <button className="pointer" onClick={openSidebar}>
              <ChevronRightIcon />
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center shadow-md bg-gray-100 py-3 px-3">
          <div className="text-write font-bold text-lg tracking-wide">Chat</div>
          <div className="flex">
            <p className="mr-4 text-sm">Connected as: {currentUser.username}</p>
            <button onClick={handleLogout}><LogoutIcon /></button>
          </div>
        </header>

        <div className="flex-1">
          <ul className="flex flex-col pt-4 overflow-y-auto scrollbar-w-2 scrolling-touch">
            {messages.map((message, i, array) => (
              <ChatMessage key={message.id} message={message} prev={array[i - 1]} />
            ))}
          </ul>
        </div>

        <footer>
          <ChatForm onMessage={handleMessage} />
        </footer>
      </div>
    </div>
  )
}

export default Chat
