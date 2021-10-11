import React, { useEffect, useState } from "react";

import { Socket } from "socket.io-client";

import { PrivateRouteProps } from "../../App";
import useSocket from "../../hooks/useSocket";
import { useGetAllMessagesQuery } from "../../state/messagesApi";
import { Message, User } from "../../types";
import ChatForm from "./ChatForm";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatSidebar from "./ChatSidebar";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT ?? "";

function Chat({ accessToken, user }: PrivateRouteProps) {
  const socket = useSocket(apiEndpoint, {
    query: { accessToken, userId: user.id },
  });

  if (!socket) {
    return <div>Socket initializing or error</div>;
  }

  return <ChatApp {...{ user, socket }} />;
}

export default Chat;

interface UserConnection {
  userId: string;
  connectionId: string;
}

function ChatApp({
  user: currentUser,
  socket,
}: {
  user: User;
  socket: Socket;
}) {
  const { data: initialMessages, isSuccess } =
    useGetAllMessagesQuery(undefined);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (isSuccess && messages.length === 0) {
      setMessages(initialMessages as Message[]);
    }
  }, [initialMessages, isSuccess, messages]);

  useEffect(() => {
    // Generals events
    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", () => console.log("Disconnected"));
    socket.on("exception", (data: any) => console.log("Exception", data));

    // Business events
    socket.on("user", (user: UserConnection) => {
      console.log("User", user);
    });

    socket.on("users", (users: UserConnection[]) => {
      console.log("Users", users);
    });

    socket.on("message", (message: Message) => {
      console.log("Message", message);
      setMessages(prev => [...prev, message]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessage = (text: string) => {
    console.log("Emit message", { text, user: currentUser.id });
    socket.emit("message", currentUser.id, text);
  };

  return (
    <div className="flex-1 flex">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader user={currentUser} />
        <ChatMessageList messages={messages} />
        <ChatForm onMessage={handleMessage} />
      </div>
    </div>
  );
}
