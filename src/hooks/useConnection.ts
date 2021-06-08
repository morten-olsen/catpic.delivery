import { useContext } from 'react';
import ConnectionContext, { States } from '../contexts/ConnectionContext';

const useConnection = () => {
  const context = useContext(ConnectionContext);
  return context;
};

export const ConnectionStates = States;

export default useConnection;
