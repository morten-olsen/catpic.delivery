import { nanoid } from 'nanoid';
import React, { createContext, useState, useCallback } from 'react';
import Session from '../Session';

interface ConnectionInfo {
  id: string;
  secret: string;
}

interface SessionsContextValue {
  sessions: Session[];
  addSession: (name?: string, id?: string, secret?: string) => void;
}

const SessionsContext = createContext<SessionsContextValue>(undefined as any);

const SessionsProvider: React.FC = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  const addSession = useCallback(() => {
    const session = new Session('Unnamed session', nanoid(), nanoid());
    setSessions(current => [
      ...current,
      session,
    ]);
  }, []);

  return (
    <SessionsContext.Provider
      value={{
        sessions,
        addSession,
      }}
    >
      {children}
    </SessionsContext.Provider>
  );
};

export { ConnectionInfo, SessionsProvider };

export default SessionsContext;
