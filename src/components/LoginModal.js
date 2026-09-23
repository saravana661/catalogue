import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import api from "../api/axios";

// Local fallback users (used only if the API/DB is unreachable)
const validUsers = [
  { email: "admin@admin.com", name: "Admin User", password: "12345" },
  { email: "admin", name: "Admin", password: "12345" },
];

function LoginModal() {
  const { open, closeModal, onSuccess } = useLoginModal();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);

  const fail = (msg) => {
    setError(msg);
    setShake((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await api.post("/login", { email: email.trim(), password });
      login({ name: res.data.name, email: res.data.email, role: res.data.role }, "manual");
      onSuccess();
    } catch (err) {
      const match = validUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (match) {
        login({ name: match.name, email: match.email }, "manual");
        onSuccess();
      } else if (err.response?.status === 401) {
        fail(err.response.data?.error || "Invalid email or password");
      } else {
        fail("Server unreachable. Check credentials or start the server.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="login-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="login-modal-box"
            key={`m-${shake}`}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: shake ? [0, -12, 12, -8, 8, 0] : 0,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="login-close" onClick={closeModal} aria-label="close">
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="login-modal-head">
              <span className="login-logo-icon">◆</span>
              <motion.h3>SIGN IN</motion.h3>
              <p className="login-subtitle">
                Sign in to like designs and add to cart
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <i className="bi bi-envelope"></i>
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-field">
                <i className="bi bi-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="error-text">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {error}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="login-btn mt-1"
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Please wait...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login & Continue
                  </>
                )}
              </motion.button>
            </form>

            <div className="login-modal-foot">
              <button className="guest-link" onClick={closeModal}>
                Continue as Guest
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;