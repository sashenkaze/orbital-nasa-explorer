import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './app/App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LibraryProvider } from './context/LibraryContext.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LibraryProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </LibraryProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
