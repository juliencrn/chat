import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";

import ChatForm from '../components/ChatForm';
import useSocket from '../hooks/useSocket';
import { ChevronLeftIcon, ChevronRightIcon, LogoutIcon } from '../components/Icons';
import { RootState } from '../state/store';
import { logout } from '../state/authSlice';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ?? ""

export interface ChatProps {
  username: string
  onLogout: () => void
}

interface Message {
  id: string
  username: string
  text: string
  postedAt: number
}

function Chat() {
  const { user, accessToken } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const socket = useSocket(apiEndpoint, {
    query: {
      access_token: accessToken || "",
    },
    // use WebSocket first, if available
    transports: ["websocket", "polling"] 
  })
  const [showSidebar, setShowSidebar] = useState(true)

  const [messages, setMessages] = useState<Message[]>([
    { id: "b44b6bea-0dca-46a6-bfde-3b83a352e8ae", postedAt: 1633565719674, username: "Julien", text: "Salut" },
    { id: "b44b6bea-0dca-46a6-bfde-3b83a352e8fe", postedAt: 1633565719673, username: "Julien", text: "Ca va ?" },
    { id: "55dabfb2-270d-4a37-8e90-12fce2362072", postedAt: 1633571715146, text: "Hola", username: "Luc" },
    { id: "5b209b67-6eab-4bb1-9243-4658308dc884", postedAt: 1633571742877, text: "Salut Ju", username: "Luc" },
    { id: "c9b24208-782e-4877-9f74-66513a648570", postedAt: 1633571736480, text: "Hey?", username: "Julien" },
  ])

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

  if (!user || !accessToken) {
    // TODO: Redirect
    dispatch(logout())
    return null
  }

  const handleMessage = (text: string) => {
    console.log("Emit message", { text, user: user.username });
    socket.emit("message", user.username, text)
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
          <button onClick={handleLogout}><LogoutIcon /></button>
        </header>

        <div className="flex-1">
          <ul className="flex flex-col pt-4 overflow-y-auto scrollbar-w-2 scrolling-touch">
            {messages.map(({ id, username: name, text, postedAt }, i, array) => {
              const isPrevAuthorEqual = i > 0 && array[i - 1].username === name
              if (isPrevAuthorEqual) {
                return (
                  <li key={id} className="flex justify-items-start px-3">
                   <div className="w-10"></div>
                    <p className="flex-1 pl-3 text-sm">
                      {text}
                    </p>
                  </li>
                )
              } else {
                return (
                  <li key={id} className="flex justify-items-start px-3 mt-3">
                    <div className="w-10 h-10 bg-purple-300 rounded-md flex">
                      <span className="m-auto text-lg uppercase bold">{name.slice(0, 1)}</span>
                    </div>
                    <div className="flex-1 pl-3 flex flex-col text-sm">
                      <p>
                        <b>{name}</b>
                        <small className="text-gray-500 pl-1">{new Date(postedAt).toLocaleString()}</small>
                      </p>
                      <p>{text}</p>
                    </div>
                  </li>
                )
              }
            })}
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
