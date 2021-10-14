import React from "react";

import { useDispatch } from "react-redux";

import { logout } from "../../state/authSlice";
import { Thread, User } from "../../types";
import { LogoutIcon } from "../Icons";

interface ChatHeaderProps {
  user: User;
  thread: Thread;
}

function ChatHeader({ user, thread }: ChatHeaderProps) {
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());

  return (
    <header className="flex justify-between items-center shadow-md bg-gray-100 py-3 px-3">
      <div className="text-write font-bold text-lg tracking-wide">
        {thread.name}
      </div>
      <div className="flex">
        <p className="mr-4 text-sm">Connected as: {user.username}</p>
        <button onClick={handleLogout}>
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
