import { useEffect, useRef } from "react";
import io, { ManagerOptions, Socket, SocketOptions } from "socket.io-client";

export type IOOptions = Partial<ManagerOptions & SocketOptions>

// TODO: When mature, add it to usehooks-ts
const useSocket = (endpointUrl: string, options?: IOOptions): Socket => {
  const { current: socket } = useRef(io(endpointUrl, options));

  useEffect(() => {
    return () => {
      socket && socket.disconnect()
    };
  }, [socket]);

  return socket;
};

export default useSocket;