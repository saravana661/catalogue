import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/pos.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useLoginModal } from "../context/LoginModalContext";

function Navbar({ onSearch, searchTerm }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { requireLogin } = useLoginModal();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const displayName = user?.name?.split(" ")[0] || "Guest";

  const openCart = () => {
    if (isAuthenticated) navigate("/cart");
    else requireLogin(() => navigate("/cart"));
  };

  const openWishlist = () => {
    if (isAuthenticated) navigate("/wishlist");
    else requireLogin(() => navigate("/wishlist"));
  };

  const openOrders = () => {
    if (isAuthenticated) navigate("/my-orders");
    else requireLogin(() => navigate("/my-orders"));
  };

  return (
    <div className="navbar-sticky">
      <nav className="navbar navbar-expand-lg navbar-white bg-white navbar-shadow">
        <div className="container-fluid px-lg-4 navbar-row">
          <Link to="/" className="text-decoration-none navbar-brand-box">
            <img
              src={logo}
              alt="Pothys Swarna Mahal"
              style={{ height: "52px", objectFit: "contain" }}
              className="navbar-logo d-inline"
            />
            <span className="navbar-brand-text d-none d-md-inline">JewelSphere</span>
          </Link>

          <div className="navbar-search-wrap">
            <div className="input-group navbar-search">
              <input
                type="text"
                className="form-control"
                placeholder="Search designs..."
                value={searchTerm || ""}
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
              <span className="input-group-text bg-white">
                <i className="bi bi-search text-danger"></i>
              </span>
            </div>
          </div>

          <div className="navbar-actions d-flex align-items-center gap-2 gap-lg-3">
            {/* User */}
            <div className="d-flex align-items-center gap-2 user-chip" title={user?.email}>
              <div className="user-avatar">
                {user?.picture ? (
                  <img src={user.picture} alt="avatar" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="d-none d-lg-block">
                <div className="user-hello small text-muted">Hello,</div>
                <div className="fw-semibold user-name">{displayName}</div>
              </div>
            </div>

            {/* My Orders */}
            <motion.button
              className="nav-icon-btn"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={openOrders}
              aria-label="my orders"
              title="My Orders"
            >
              <i className="bi bi-bag-check fs-5"></i>
            </motion.button>

            {/* Wishlist */}
            <motion.button
              className="nav-icon-btn"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={openWishlist}
              aria-label="wishlist"
            >
              <i className="bi bi-heart text-danger fs-5"></i>
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    className="icon-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cart */}
            <motion.button
              className="nav-icon-btn"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={openCart}
              aria-label="cart"
            >
              <i className="bi bi-cart fs-5"></i>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    className="icon-badge orange"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key={cartCount}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Login / Logout */}
            {isAuthenticated ? (
              <motion.button
                className="btn btn-outline-danger btn-sm px-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                title="Logout"
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-lg-inline ms-1">Logout</span>
              </motion.button>
            ) : (
              <motion.button
                className="btn btn-gold btn-sm px-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => requireLogin()}
                title="Login"
              >
                <i className="bi bi-person"></i>
                <span className="d-none d-lg-inline ms-1">Login</span>
              </motion.button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;