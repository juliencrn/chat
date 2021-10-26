import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { useEventListener } from "usehooks-ts";

import useElementSize from "../../hooks/useElementSize";
import { useGetMessagesByThreadQuery } from "../../state/api/messagesApi";
import { setAllMessages } from "../../state/slices/chatSlice";
import { Message, ThreadState } from "../../types";
import ChatMessage from "./ChatMessage";

interface ChatMessageListProps {
  thread: ThreadState;
}

function ChatMessageList({ thread }: ChatMessageListProps) {
  const messages = thread.messages;

  const dispatch = useDispatch();
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const listRef = useRef<null | HTMLUListElement>(null);
  const [lastId, setLastId] = useState<string | undefined>();
  const messagesQuery = useGetMessagesByThreadQuery({
    threadId: thread.id,
    lastId,
  });
  const { height: wrapperHeight } = useElementSize(wrapperRef, [messages]);
  const { height: listHeight } = useElementSize(listRef, [messages]);
  const [prevListHeight, setPrevListHeight] = useState(listHeight);

  const { isSuccess, data: apiMessages } = messagesQuery;

  // on receive post, send it to Redux
  useEffect(() => {
    if (apiMessages && isSuccess) {
      const messages = messagesQuery.data as Message[];
      dispatch(setAllMessages({ messages, threadSlug: thread.slug }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiMessages, isSuccess, thread.slug]);

  // When chat height changed, check if we need refetch messages
  useEffect(() => {
    if (listHeight < wrapperHeight) {
      handleRefetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listHeight, wrapperHeight]);

  // Scroll to the bottom to see the last messages
  useLayoutEffect(() => {
    if (listHeight && wrapperRef.current) {
      if (thread.lastAddingMethod === "api_refetch") {
        const addedHeight = listHeight - prevListHeight;
        if (addedHeight) {
          wrapperRef.current.scrollTop += addedHeight;
        }
      } else {
        wrapperRef.current.scrollTop = listHeight;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, listHeight, listRef]);

  // Infinite scroll
  // TODO: Use intersection observer will be better
  const onScroll = () => {
    if (wrapperRef.current && wrapperRef.current.scrollTop < 50) {
      handleRefetch();
    }
  };
  useEventListener("scroll", onScroll, wrapperRef);

  const handleRefetch = () => {
    const hasItem = thread.lastAddingMethod !== "last_fetch";
    const newLastId = messages.length ? messages[0].id : undefined;
    if (newLastId && lastId !== newLastId && hasItem) {
      setLastId(newLastId);
      setPrevListHeight(listHeight);
    }
  };

  return (
    <div ref={wrapperRef} className="flex-1 relative overflow-y-auto">
      <ul ref={listRef} className="flex flex-col pt-4 scrolling-touch">
        {messages.map((message, i, array) => (
          <ChatMessage key={message.id} message={message} prev={array[i - 1]} />
        ))}
      </ul>
    </div>
  );
}

export default ChatMessageList;
