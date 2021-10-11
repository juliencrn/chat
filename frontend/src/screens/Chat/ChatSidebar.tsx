import React, { useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "../../components/Icons";
import UserList from "./UserList";

function ChatSidebar() {
  const [showSidebar, setShowSidebar] = useState(true);

  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);

  return (
    <aside
      className={`bg-gray-800 text-white py-3 px-3 ${
        showSidebar ? "w-60" : "w-15"
      }`}
    >
      <div className={`flex justify-between items-center mb-4`}>
        {showSidebar ? (
          <>
            <div className="font-bold text-lg tracking-wide">Chat app</div>
            <button className="pointer" onClick={closeSidebar}>
              <ChevronLeftIcon />
            </button>
          </>
        ) : (
          <button className="pointer" onClick={openSidebar}>
            <ChevronRightIcon />
          </button>
        )}
      </div>

      <UserList />
    </aside>
  );
}

export default ChatSidebar;
