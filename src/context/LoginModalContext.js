import React, { createContext, useState, useContext, useRef } from "react";
import LoginModal from "../components/LoginModal";

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const pendingAction = useRef(null);

  const requireLogin = (action) => {
    pendingAction.current = action || null;
    setOpen(true);
  };

  const closeModal = () => {
    pendingAction.current = null;
    setOpen(false);
  };

  const onSuccess = () => {
    const action = pendingAction.current;
    pendingAction.current = null;
    setOpen(false);
    if (typeof action === "function") action();
  };

  return (
    <LoginModalContext.Provider
      value={{ open, requireLogin, closeModal, onSuccess }}
    >
      {children}
      <LoginModal />
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => useContext(LoginModalContext);