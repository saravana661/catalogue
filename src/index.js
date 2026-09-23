import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LoginModalProvider } from './context/LoginModalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppWithProviders = (
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <LoginModalProvider>
            <App />
          </LoginModalProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

root.render(AppWithProviders);