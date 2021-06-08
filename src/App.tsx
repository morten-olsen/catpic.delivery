import React from 'react';
import Welcome from './containers/Welcome';
import Connected from './containers/Connected';
import useConnection, { ConnectionStates } from './hooks/useConnection';

const App: React.FC<{}> = () => {
  const { state } = useConnection();

  if (state === ConnectionStates.WAITING) {
    return <Welcome />
  }
  if (state === ConnectionStates.CONNECTED) {
    return <Connected />
  }
  return (
    <div>Connected</div>
  );
};

export default App;
