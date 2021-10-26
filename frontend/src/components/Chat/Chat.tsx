import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";

import { addMessage, refreshConnections } from "../../state/slices/chatSlice";
import { addToast } from "../../state/slices/toasterSlice";
import { Message, ThreadState, User, UserConnection } from "../../types";
import ChatForm from "./ChatForm";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatSidebar from "./ChatSidebar";

interface ChatProps {
  user: User;
  socket: Socket;
  threadState: ThreadState;
}

interface CreateSocketMessageDto {
  text: string;
  userId: string;
  threadId: string;
}

function Chat({ user: currentUser, socket, threadState }: ChatProps) {
  const dispatch = useDispatch();

  // Ask fresh user list on load
  useEffect(() => {
    socket.emit("users");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Generals events
    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", () => console.log("Disconnected"));

    // Business events
    socket.on("user", (newUser: User) => {
      if (newUser.id !== currentUser.id) {
        addToast(dispatch, `${newUser.username} just joined the chat!`);
      }
    });

    socket.on("users", (conns: UserConnection[]) => {
      dispatch(refreshConnections(conns));
    });

    socket.on("message", (message: Message) => {
      dispatch(addMessage({ message, threadSlug: message.thread.slug }));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessage = (text: string) => {
    const messageRequest: CreateSocketMessageDto = {
      userId: currentUser.id,
      threadId: threadState.id,
      text,
    };
    socket.emit("message", messageRequest);
  };

  return (
    <div className="fixed top-0 left-0 h-full w-full flex">
      <ChatSidebar />
      <div className="flex-1 flex flex-col relative pb-16">
        <ChatHeader user={currentUser} thread={threadState} />
        <ChatMessageList thread={threadState} />
        <ChatForm onMessage={handleMessage} />
      </div>
    </div>
  );
}

export default Chat;
