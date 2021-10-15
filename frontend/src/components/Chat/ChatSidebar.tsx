import React, { useEffect, useState } from "react";

import { useBoolean, useWindowSize } from "usehooks-ts";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "../Icons";
import ThreadList from "./ThreadList";
import UserList from "./UserList";

function ChatSidebar() {
  const { width } = useWindowSize();
  const isDesktop = width > 768;
  const [showSidebar, setShowSidebar] = useState(isDesktop);

  const openSidebar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);

  useEffect(() => {
    setShowSidebar(isDesktop);
  }, [isDesktop]);

  return (
    <aside
      className={`bg-gray-800 text-gray-300  flex flex-col ${
        showSidebar ? "w-56" : "w-15"
      }`}
    >
      <div className={`flex justify-between items-center shadow py-3 px-4`}>
        {showSidebar ? (
          <>
            <h2 className="font-bold text-md tracking-wide">Chat app</h2>
            <button className="cursor-pointer" onClick={closeSidebar}>
              <ChevronLeftIcon />
            </button>
          </>
        ) : (
          <button className="cursor-pointer" onClick={openSidebar}>
            <ChevronRightIcon />
          </button>
        )}
      </div>

      {showSidebar && (
        <div className="overflow-y-auto no-scrollbar flex-1 py-3 px-3">
          <SidebarModule title="Threads">
            <ThreadList />
          </SidebarModule>

          <SidebarModule title="Users">
            <UserList />
          </SidebarModule>
        </div>
      )}
    </aside>
  );
}

export default ChatSidebar;

interface SidebarModuleProps {
  title: string;
  children: React.ReactNode;
}

function SidebarModule({ title, children }: SidebarModuleProps) {
  const { value: open, toggle } = useBoolean(true);
  return (
    <div className="mb-4">
      <button className="flex items-center cursor-pointer" onClick={toggle}>
        {open ? <ChevronDownIcon /> : <ChevronUpIcon />}
        <span className="pl-1 font-bold text-lg">{title}</span>
      </button>
      {open && <div className="pl-4 py-2">{children}</div>}
    </div>
  );
}
