import React, { memo } from "react";

import { Message } from "../../types";
import { sortByTime } from "../../utils";
import ChatMessage from "./ChatMessage";

interface ChatMessageListProps {
  messages: Message[];
}

function ChatMessageList({ messages }: ChatMessageListProps) {
  const sortedByDatetimeMessages = sortByTime(messages);
  return (
    <div className="flex-1">
      <ul className="flex flex-col pt-4 overflow-y-auto scrollbar-w-2 scrolling-touch">
        {sortedByDatetimeMessages.map((message, i, array) => (
          <ChatMessage key={message.id} message={message} prev={array[i - 1]} />
        ))}
      </ul>
    </div>
  );
}

export default memo(ChatMessageList);
