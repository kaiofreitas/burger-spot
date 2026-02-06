import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AdminApp } from './AdminApp';
import { useHashRoute } from './hooks/useHashRoute';

const Root: React.FC = () => {
  const { isAdmin } = useHashRoute();
  return isAdmin ? <AdminApp /> : <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
