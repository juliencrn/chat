import React from "react";

import { Message, User } from "../../types";
import { compareTime } from "../../utils";
import Avatar from "../Avatar";

export interface ChatMessageProps {
  message: Message;
  prev?: Message;
}

function ChatMessage({ message, prev }: ChatMessageProps) {
  const { user, createdAt, text } = message;

  const MinimizedMessage = () => (
    <li className="flex justify-items-start px-6">
      <div className="w-10"></div>
      <p className="flex-1 pl-2 text-sm">{text}</p>
    </li>
  );

  const ExpandedMessage = () => (
    <li className="flex justify-items-start px-6 mt-3">
      <Avatar username={user.username} />
      <div className="flex-1 pl-2 flex flex-col text-sm">
        <p>
          <b className="">{user.username}</b>
          <small className="text-gray-500 pl-2">
            {new Date(createdAt).toLocaleString()}
          </small>
        </p>
        <p>{text}</p>
      </div>
    </li>
  );

  let collapse = false;
  if (prev) {
    const sameAuthor = prev.user.id === user.id;
    const diff = compareTime(message, prev);
    const timeIsNear = diff < 15 * 60 * 1000; // 15min;

    collapse = sameAuthor && timeIsNear;
  }

  return collapse ? <MinimizedMessage /> : <ExpandedMessage />;
}

export default ChatMessage;
