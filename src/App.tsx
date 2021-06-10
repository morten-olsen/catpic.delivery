import React, { useEffect } from 'react';
import Welcome from './containers/Welcome';
import Connected from './containers/Connected';
import { SessionProvider } from './contexts/SessionContext';
import useSessions from './hooks/useSessions';
import Session from './containers/Session';

const App: React.FC<{}> = () => {
  const { sessions, addSession } = useSessions();

  useEffect(() => {
    if (sessions.length === 0) {
      addSession()
    }
  }, [sessions.length]);

  if (sessions.length === 0) {
    return <div>Setting up</div>
  }

  return (
    <>
      {sessions.map((session) => (
        <SessionProvider session={session}>
          <Session />
        </SessionProvider>
      ))}
    </>
  )
};

export default App;
