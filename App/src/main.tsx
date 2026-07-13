import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/reset.css';
import './styles/tokens/spacing.css';
import './styles/tokens/colors.css';
import './styles/tokens/typography.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
