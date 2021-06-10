import React from 'react';
import { render } from 'react-dom';
import { SessionsProvider } from './contexts/SessionsContext';
import App from './App';

const root = document.getElementById('root');
const app = (
  <SessionsProvider>
    <App />
  </SessionsProvider>
);

render(app, root);

if ((module as any).hot) {
  (module as any).hot.accept()
}
