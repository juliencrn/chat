import { useEffect, useRef } from "react";
import io, { Socket, SocketOptions } from "socket.io-client";

// TODO: When mature, add it to usehooks-ts
const useSocket = (endpointUrl: string, options?: SocketOptions): Socket => {
  const { current: socket } = useRef(io(endpointUrl, options));

  useEffect(() => {
    return () => {
      socket && socket.disconnect()
    };
  }, [socket]);

  return socket;
};

export default useSocket;