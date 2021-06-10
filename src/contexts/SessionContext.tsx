import React, { createContext, ReactNode, useState, useEffect, useCallback } from 'react';
import Session, { State } from '../Session';

interface SessionContextValue {
  messages: any[];
  send: (data: any) => Promise<void>;
  connectInfo: any;
  state: State;
  connect: (id: string, secret: string) => any;
}

interface SessionProviderProps {
  session: Session;
  children: ReactNode;
}

type Message = any;

const SessionContext = createContext<SessionContextValue>(undefined as any);

const SessionProvider: React.FC<SessionProviderProps> = ({ session, children }) => {
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const [state, setState] = useState<State>(session.state);
  const update = useCallback(() => {
    setMessages(session.messages);
    setState(session.state);
  }, [session]);

  useEffect(() => {
    session.on('updated', update);

    return () => {
      session.off('updated', update);
    }
  }, [session, update]);
  
  return (
    <SessionContext.Provider
      value={{
        send: session.send,
        messages,
        connectInfo: session.connectInfo,
        state,
        connect: session.connect,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
};

export { SessionProvider };

export default SessionContext;
