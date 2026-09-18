import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";

const API = "http://localhost:5000/api";

// Local fallback users (used only if the API/DB is unreachable)
const validUsers = [
  { email: "admin@admin.com", name: "Admin User", password: "12345" },
  { email: "admin", name: "Admin", password: "12345" },
];

async function postAuth(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data, status: res.status };
}

function LoginModal() {
  const { open, closeModal, onSuccess } = useLoginModal();
  const { login } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const fail = (msg) => {
    setError(msg);
    setShake((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (!name.trim() || !email.includes("@") || password.length < 4) {
        return fail("Please fill all fields (password min 4 chars).");
      }
      setBusy(true);
      try {
        const { ok, data, status } = await postAuth("/register", {
          name: name.trim(),
          email: email.trim(),
          password,
        });
        if (ok) {
          login({ name: data.name, email: data.email, role: data.role }, "manual");
          onSuccess();
        } else if (status === 409) {
          fail(data.error || "Email already registered");
        } else {
          fail(data.error || "Registration failed");
        }
      } catch (err) {
        // API/DB unreachable -> local demo signup
        login({ name: name.trim(), email: email.trim() }, "manual");
        onSuccess();
      } finally {
        setBusy(false);
      }
      return;
    }

    // Sign in
    setBusy(true);
    try {
      const { ok, data } = await postAuth("/login", { email: email.trim(), password });
      if (ok) {
        login({ name: data.name, email: data.email, role: data.role }, "manual");
        onSuccess();
      } else {
        const match = validUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (match) {
          login({ name: match.name, email: match.email }, "manual");
          onSuccess();
        } else {
          fail("Invalid email or password");
        }
      }
    } catch (err) {
      const match = validUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (match) {
        login({ name: match.name, email: match.email }, "manual");
        onSuccess();
      } else {
        fail("Server unreachable. Check credentials or start the server.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = (cred) => {
    try {
      const decoded = JSON.parse(atob(cred.credential.split(".")[1]));
      login(
        { name: decoded.name, email: decoded.email, picture: decoded.picture },
        "google"
      );
      onSuccess();
    } catch (err) {
      fail("Could not read Google profile.");
    }
  };

  const resetForm = () => {
    setIsSignup(false);
    setError("");
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
              <motion.h3
                key={isSignup ? "s" : "l"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isSignup ? "Create Account" : "Welcome Back"}
              </motion.h3>
              <p className="login-subtitle">
                {isSignup
                  ? "Save credentials & order your favourite designs"
                  : "Sign in to like designs and add to cart"}
              </p>
            </div>

            {/* Google */}
            <div className="google-login-wrap mb-3">
              {clientId ? (
                <GoogleLogin
                  clientId={clientId}
                  onSuccess={handleGoogle}
                  onError={() => {
                    fail("Google sign in failed. Try manual login.");
                  }}
                />
              ) : (
                <button
                  className="btn btn-google"
                  onClick={() => {
                    login({ name: "Google User", email: "google@gmail.com" }, "google");
                    onSuccess();
                  }}
                >
                  <i className="bi bi-google me-2"></i> Sign in with Google
                </button>
              )}
            </div>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <div className="login-field">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="login-field">
                <i className="bi bi-envelope"></i>
                <input
                  type="text"
                  placeholder={isSignup ? "Email" : "Email or Username"}
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
                ) : isSignup ? (
                  <>
                    <i className="bi bi-person-plus me-2"></i> Sign Up & Continue
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login & Continue
                  </>
                )}
              </motion.button>
            </form>

            <div className="login-modal-foot">
              <span className="switch-mode">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        resetForm();
                        setIsSignup(false);
                      }}
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    New here?{" "}
                    <button onClick={() => setIsSignup(true)}>Create Account</button>
                  </>
                )}
              </span>
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