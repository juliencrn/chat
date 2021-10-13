import React from "react";

import { useLocation } from "react-router";

export default function NotFound() {
  const location = useLocation();
  return (
    <div className="w-full h-full fixed flex top-0 left-0 bg-white opacity-75 z-50">
      <span className="top-1/2 my-0 m-auto block relative">
        <h3>
          No match for <code>{location.pathname}</code>
        </h3>
      </span>
    </div>
  );
}
