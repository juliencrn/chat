import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  addMessage,
  setAllMessages,
  updateConnections,
} from "../../state/chatSlice";
import { useGetAllMessagesQuery } from "../../state/messagesApi";
import { RootState } from "../../state/store";
import { Message, Thread, User, UserConnection } from "../../types";
import ChatForm from "./ChatForm";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatSidebar from "./ChatSidebar";

interface ChatProps {
  user: User;
  socket: Socket;
  thread: Thread;
}

function Chat({ user: currentUser, socket }: ChatProps) {
  const { data: initialMessages, isSuccess } =
    useGetAllMessagesQuery(undefined);
  const thread = useSelector((state: RootState) => state.chat);
  const { messages } = thread;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && messages.length === 0) {
      dispatch(setAllMessages(initialMessages as Message[]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages, isSuccess, messages]);

  useEffect(() => {
    // Generals events
    socket.on("connect", () => console.log("Connected"));
    socket.on("disconnect", () => console.log("Disconnected"));
    socket.on("exception", (data: any) => console.log("Exception", data));

    // Business events
    socket.on("users", (conns: UserConnection[]) => {
      dispatch(updateConnections(conns));
    });

    socket.on("message", (message: Message) => {
      dispatch(addMessage(message));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessage = (text: string) => {
    socket.emit("message", currentUser.id, text);
  };

  return (
    <div className="flex-1 flex">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader user={currentUser} thread={thread} />
        <ChatMessageList messages={messages} />
        <ChatForm onMessage={handleMessage} />
      </div>
    </div>
  );
}

export default Chat;
