import React from 'react';
import { render } from 'react-dom';
import { ConnectionProvider } from './contexts/ConnectionContext';
import App from './App';

const root = document.getElementById('root');
const app = (
  <ConnectionProvider>
    <App />
  </ConnectionProvider>
);

render(app, root);
