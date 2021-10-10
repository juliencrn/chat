import React from 'react'

import { Message } from '../../types';
import ChatMessage from './ChatMessage';

interface ChatMessageListProps {
    messages: Message[]
}

function ChatMessageList({ messages }: ChatMessageListProps) {
    return (
      <div className="flex-1">
        <ul className="flex flex-col pt-4 overflow-y-auto scrollbar-w-2 scrolling-touch">
          {messages.map((message, i, array) => (
            <ChatMessage key={message.id} message={message} prev={array[i - 1]} />
          ))}
        </ul>
      </div>
    )
}

export default ChatMessageList;