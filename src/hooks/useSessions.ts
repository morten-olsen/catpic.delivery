import { useContext } from 'react';
import SessionsContext from '../contexts/SessionsContext';

const useSessions = () => {
  const context = useContext(SessionsContext);
  return context;
};

export default useSessions;
