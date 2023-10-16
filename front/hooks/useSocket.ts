import io from 'socket.io-client';
import { StyleHTMLAttributes, useCallback } from 'react';

const backUrl = 'http://localhost:3095';

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string) => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, []);
  if (!workspace) {
    return [undefined, disconnect];
  }
  sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`); // 연결

  return [sockets[workspace], disconnect];
};

export default useSocket;
