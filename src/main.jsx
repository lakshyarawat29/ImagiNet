import React from 'react';
import { createRoot } from 'react-dom/client'; // ✅ Add this line
import App from './App.jsx';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
