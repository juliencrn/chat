import React from 'react'
import { Message } from '../../types';

export interface ChatMessageProps {
    message: Message
    prev?: Message
}

function ChatMessage({ message, prev }: ChatMessageProps) {
    const { user, createdAt, text } = message

    const MinimizedMessage = () => (
        <li className="flex justify-items-start px-3">
            <div className="w-10"></div>
            <p className="flex-1 pl-3 text-sm">
                {text}
            </p>
        </li>
    )

    const ExpandedMessage = () => (
        <li className="flex justify-items-start px-3 mt-3">
            <div className="w-10 h-10 bg-purple-300 rounded-md flex">
                <span className="m-auto text-lg uppercase bold">{user.username.slice(0, 1)}</span>
            </div>
            <div className="flex-1 pl-3 flex flex-col text-sm">
                <p>
                <b>{user.username}</b>
                <small className="text-gray-500 pl-1">{new Date(createdAt).toLocaleString()}</small>
                </p>
                <p>{text}</p>
            </div>
        </li>
    )

    return prev && prev.user.id === user.id
        ? <MinimizedMessage />
        : <ExpandedMessage />
}

export default ChatMessage