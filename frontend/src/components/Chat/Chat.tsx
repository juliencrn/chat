import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";

import {
  addMessage,
  setAllMessages,
  updateConnections,
} from "../../state/chatSlice";
import { useGetMessagesByThreadQuery } from "../../state/messagesApi";
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
  const threadId = threadState.id;
  const threadSlug = threadState.slug;
  const dispatch = useDispatch();
  const messagesQuery = useGetMessagesByThreadQuery(threadId);
  const { isSuccess, data: initialMessages } = messagesQuery;

  // Load initial messages
  useEffect(() => {
    if (initialMessages && !threadState.fetched && isSuccess) {
      const messages = messagesQuery.data as Message[];
      dispatch(setAllMessages({ messages, threadSlug }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages, isSuccess, threadSlug]);

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
      dispatch(addMessage({ message, threadSlug: message.thread.slug }));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessage = (text: string) => {
    const messageRequest: CreateSocketMessageDto = {
      userId: currentUser.id,
      threadId,
      text,
    };
    socket.emit("message", messageRequest);
  };

  return (
    <div className="flex-1 flex">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader user={currentUser} thread={threadState} />
        <ChatMessageList messages={threadState.messages} />
        <ChatForm onMessage={handleMessage} />
      </div>
    </div>
  );
}

export default Chat;
