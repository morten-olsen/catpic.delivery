import React, { createContext, useMemo, useState, useCallback, useEffect } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { nanoid } from 'nanoid';
import useCrypto from '../hooks/useCrypto';

enum States {
  WAITING,
  CONNECTING,
  CONNECTED,
}

interface ConnectionContextValue {
  clientInfo: any;
  state: States;
  messages: any[];
  send: (message: any) => Promise<void>;
  connect: (connectionInfo: any) => Promise<void>;
}

interface Message {
  id: string;
  packages: number;
  content: string;
}

function dataURItoBlob(dataURI: string) {
  var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
     array.push(binary.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], {type: mime});
  return URL.createObjectURL(blob);
}

const ConnectionContext = createContext<ConnectionContextValue>(undefined as any);

const ConnectionProvider: React.FC = ({ children }) => {
  const [secret, setSecret] = useState(nanoid());
  const { encrypt, decrypt } = useCrypto(secret);
  const id = useMemo(() => nanoid(), []);
  const peer = useMemo(() => new Peer(id), [id]);
  const [connection, setConnection] = useState<DataConnection | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<States>(States.WAITING);
  const clientInfo = useMemo(() => ({
    id,
    secret,
  }), [id]);

  const send = useCallback(async (message: any) => {
    if (!connection) return;
    setMessages(current => [
      ...current,
      {
        ...message,
        body: dataURItoBlob(message.body),
      },
    ]);
    connection.send(await encrypt(message)); 
  }, [connection, encrypt]);

  const connect = useCallback(async (clientInfo: any) => {
    setState(States.CONNECTING);
    const newConnection = peer.connect(clientInfo.id);
    newConnection.on('open', () => {
      setSecret(clientInfo.secret);
      setState(States.CONNECTED);
      setConnection(newConnection);
      console.log('connected', newConnection);
    });
  }, [peer]);

  useEffect(() => {
    const onConnect = (newConnection: DataConnection) => {
      setState(States.CONNECTED);
      setConnection(newConnection);
      console.log('connected', newConnection);
    };
    peer.on('connection', onConnect);

    return () => {
      peer.off('connection', onConnect);
    };
  }, [peer]);

  useEffect(() => {
    if (!connection) {
      return;
    }
    const handleData = async (encrypted: any) => {
      const message = await decrypt(encrypted);
      setMessages(current => [
        ...current,
        {
          ...message,
          body: dataURItoBlob(message.body),
        },
      ]);
    };
    connection.on('data', handleData);
    return () => {
      connection.off('data', handleData);
    }
  }, [connection, decrypt]);


  return (
    <ConnectionContext.Provider
      value={{
        clientInfo,
        state,
        messages,
        send,
        connect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export { States, ConnectionProvider };

export default ConnectionContext;
