import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LoginModalProvider } from './context/LoginModalContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const AppWithProviders = (
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <LoginModalProvider>
            {googleClientId ? (
              <GoogleOAuthProvider clientId={googleClientId}>
                <App />
              </GoogleOAuthProvider>
            ) : (
              <App />
            )}
          </LoginModalProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

root.render(AppWithProviders);