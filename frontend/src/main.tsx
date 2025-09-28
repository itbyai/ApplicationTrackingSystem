import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 开发环境启用严格模式
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);