import React from "react";

import { PrivateRouteProps } from "../App";

export default function Home(props: PrivateRouteProps) {
  return (
    <div className="w-full h-full fixed flex top-0 left-0 bg-white opacity-75 z-50">
      <span className="top-1/2 my-0 m-auto block relative">
        <h3>Hello {props.user.username}</h3>
      </span>
    </div>
  );
}
