import React from 'react';
import useSession, { State } from '../hooks/useSession';
import Welcome from './Welcome';
import Connected from './Connected';

const Session: React.FC<{}> = () => {
  const { state } = useSession();

  if (state === State.READY) {
    return (
      <Welcome />
    );
  }

  if (state === State.CONNECTED) {
    return <Connected />
  }

  return (
    <div>{state.toString()}</div>
  )
};

export default Session;
