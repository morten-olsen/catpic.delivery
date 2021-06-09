import React, { createContext, useMemo, useState, useCallback, useEffect } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { nanoid } from 'nanoid';
import useCrypto from '../hooks/useCrypto';
import useMessages from '../hooks/useMessages';

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

const postProcess = (input: any) => {
  if (input.mediaType === 'file') {
    return {
      ...input,
      body: dataURItoBlob(input.body),
    };
  }
  return input;
};

const ConnectionProvider: React.FC = ({ children }) => {

  const { messages, addMessage, formatMessage } = useMessages(postProcess);
  const [secret, setSecret] = useState(nanoid());
  const { encrypt, decrypt } = useCrypto(secret);
  const id = useMemo(() => nanoid(), []);
  const peer = useMemo(() => new Peer(id), [id]);
  const [connection, setConnection] = useState<DataConnection | undefined>(undefined);
  const [state, setState] = useState<States>(States.WAITING);
  const clientInfo = useMemo(() => ({
    id,
    secret,
  }), [id]);

  const send = useCallback(async (message: any) => {
    if (!connection) return;
    const { startMsg, updateMsgs } = formatMessage(message);

    addMessage(startMsg, true);
    connection.send(await encrypt(startMsg)); 
    for (let updateMsg of updateMsgs) {
      connection.send(await encrypt(updateMsg));
      addMessage(updateMsg);
    }
  }, [connection, encrypt]);

  const connect = useCallback(async (clientInfo: any) => {
    setState(States.CONNECTING);
    const newConnection = peer.connect(clientInfo.id);
    newConnection.on('open', () => {
      setSecret(clientInfo.secret);
      setState(States.CONNECTED);
      setConnection(newConnection);
    });
  }, [peer]);

  useEffect(() => {
    if (connection) {
      return;
    }
    const onConnect = (newConnection: DataConnection) => {
      setState(States.CONNECTED);
      setConnection(newConnection);
    };
    peer.on('connection', onConnect);

    return () => {
      peer.off('connection', onConnect);
    };
  }, [peer, connection]);

  useEffect(() => {
    if (!connection) {
      return;
    }
    const handleData = async (encrypted: any) => {
      const message = await decrypt(encrypted);
      addMessage(message, false);
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
