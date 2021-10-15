import React from "react";

import cn from "classnames";

interface AvatarProps {
  username: string;
  size?: "sm" | "md";
}

function Avatar({ username, size }: AvatarProps) {
  const classes = cn(
    size === "sm" ? "w-8 h-8 text-md" : "w-10 h-10 text-lg",
    "bg-purple-300 rounded-md flex uppercase bold",
  );

  return (
    <div className={classes}>
      <span className="m-auto">{username.slice(0, 1)}</span>
    </div>
  );
}

export default Avatar;
