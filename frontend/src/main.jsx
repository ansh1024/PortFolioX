import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import './styles/tokens.css';
import './styles/globals.css';
import AuthProvider from './context/AuthProvider.jsx';
import App from './app/App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><AuthProvider><App /></AuthProvider></React.StrictMode>,
);
