import { useContext } from 'react';
import { State } from '../Session';
import SessionContext from '../contexts/SessionContext';

const useSession = () => {
  const context = useContext(SessionContext);
  return context;
};

export { State };

export default useSession;
