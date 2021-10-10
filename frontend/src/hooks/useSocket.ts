import { useEffect, useState } from "react";
import { ManagerOptions, Socket, SocketOptions, io } from "socket.io-client";

export type IOOptions = Partial<ManagerOptions & SocketOptions>

const defaultOptions: IOOptions = {
  // use WebSocket first, if available
  transports: ["websocket", "polling"] 
}

// TODO: When mature, add it to usehooks-ts
const useSocket = (endpointUrl: string, options?: IOOptions): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io(endpointUrl, { ...defaultOptions, ...options});

    setSocket(newSocket);

    return () => {
      newSocket.close()
    }
  }, [setSocket])

  return socket;
}

export default useSocket;