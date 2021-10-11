import React from "react";

import { useDispatch } from "react-redux";

import { LogoutIcon } from "../../components/Icons";
import { logout } from "../../state/authSlice";
import { User } from "../../types";

interface ChatHeaderProps {
  user: User;
}

function ChatHeader({ user }: ChatHeaderProps) {
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());

  return (
    <header className="flex justify-between items-center shadow-md bg-gray-100 py-3 px-3">
      <div className="text-write font-bold text-lg tracking-wide">Chat</div>
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
