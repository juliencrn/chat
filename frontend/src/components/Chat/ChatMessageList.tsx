import React, { memo, useEffect, useRef } from "react";

import { useElementSize } from "usehooks-ts";

import { Message } from "../../types";
import { sortByTime } from "../../utils";
import ChatMessage from "./ChatMessage";

interface ChatMessageListProps {
  messages: Message[];
}

function ChatMessageList({ messages }: ChatMessageListProps) {
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const listRef = useRef<null | HTMLUListElement>(null);
  const { height: listHeight } = useElementSize(listRef);
  const sortedByDatetimeMessages = sortByTime(messages);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (listHeight && wrapperRef.current) {
      wrapperRef.current.scrollTop = listHeight;
    }
  }, [messages, listHeight]);

  return (
    <div ref={wrapperRef} className="flex-1 overflow-y-auto">
      <ul ref={listRef} className="flex flex-col pt-4 scrolling-touch">
        {sortedByDatetimeMessages.map((message, i, array) => (
          <ChatMessage key={message.id} message={message} prev={array[i - 1]} />
        ))}
      </ul>
    </div>
  );
}

export default memo(ChatMessageList);
