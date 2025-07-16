import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';            // Imports your main component
import './index.css';              // Imports Tailwind or global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />                        {/* Renders the App component */}
  </React.StrictMode>
);
