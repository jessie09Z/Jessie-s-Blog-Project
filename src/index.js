import React from 'react';
import ReactDOM from 'react-dom/client'; // 从 'react-dom/client' 导入 createRoot
import App from "./components/App"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);