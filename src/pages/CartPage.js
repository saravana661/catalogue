import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLoginModal } from "../context/LoginModalContext";
import api from "../api/axios";

function CartPage() {
  const { isAuthenticated, user } = useAuth();
  const { requireLogin } = useLoginModal();
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) requireLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalItems = cart.reduce((s, p) => s + p.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowConfirm(true);
  };

  const confirmOrder = async () => {
    setShowConfirm(false);
    setPlacing(true);
    setOrderError("");
    try {
      await api.post("/orders", {
        items: cart,
        customer: {
          name: user?.name || "Guest",
          email: user?.email || "",
          provider: user?.provider || "",
        },
      });
      clearCart();
      setPurchased(true);
      setTimeout(() => {
        setPurchased(false);
        navigate("/");
      }, 2600);
    } catch (err) {
      setOrderError("Could not place order. Server may be offline.");
    } finally {
      setPlacing(false);
    }
  };

  if (purchased) {
    return (
      <motion.div
        className="checkout-success"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <i className="bi bi-check-circle-fill"></i>
        </motion.div>
        <h3>Order Placed Successfully!</h3>
        <p>Thank you for shopping with Pothys Swarna Mahal</p>
        <div className="spinner-border text-warning mt-3"></div>
      </motion.div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>
          <i className="bi bi-cart3 me-2"></i> Your Cart
          <span className="count-chip">{cart.length}</span>
        </h2>
        {cart.length > 0 && (
          <button className="btn btn-link text-danger" onClick={clearCart}>
            <i className="bi bi-trash me-1"></i> Clear All
          </button>
        )}
      </motion.div>

      {cart.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <i className="bi bi-bag-x empty-icon"></i>
          <h4>Your cart is empty</h4>
          <p>Looks like you haven't added any designs yet.</p>
          <Link to="/" className="btn btn-dark px-4">
            <i className="bi bi-arrow-left me-2"></i> Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-9">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  layout
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                >
                  <div className="cart-item-img">
                    {item.ImageBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${item.ImageBase64}`}
                        alt={item.SubProName}
                      />
                    ) : (
                      <div className="cart-item-placeholder">◆</div>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h6>{item.SubProName}</h6>
                    <div className="cart-item-meta">
                      {item.ProName && (
                        <span>
                          <i className="bi bi-diagram-3"></i> {item.ProName}
                        </span>
                      )}
                      <span>
                        <i className="bi bi-tag"></i> {item.TagNo || "N/A"}
                      </span>
                      <span>
                        <i className="bi bi-bounding-box"></i> {item.NetWt} g
                      </span>
                      {item.metal && (
                        <span className="badge metal-badge">{item.metal}</span>
                      )}
                    </div>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>
                        <i className="bi bi-dash"></i>
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="col-lg-3">
            <motion.div
              className="order-summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h5>Order Summary</h5>
              <div className="summary-row">
                <span>Total Items</span>
                <span className="fw-bold">{totalItems}</span>
              </div>
              <div className="summary-row">
                <span>Designs</span>
                <span className="fw-bold">{cart.length}</span>
              </div>
              <hr />
              <p className="small text-muted mb-3">
                <i className="bi bi-info-circle me-1"></i>
                No payment needed at this stage. Your order will be confirmed with
                the boutique.
              </p>
              <motion.button
                className="btn btn-gold w-100"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
              >
                <i className="bi bi-bag-check me-2"></i> Confirm Order
              </motion.button>
              <Link to="/" className="btn btn-link w-100 text-muted mt-2">
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              className="confirm-modal"
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h5>
                <i className="bi bi-bag-check me-2"></i> Confirm Order
              </h5>
              <p>
                You are about to place an order with{" "}
                <strong>{totalItems} item(s)</strong>. A boutique representative
                will contact you to finalise the purchase.
              </p>
              {orderError && (
                <p className="error-text">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {orderError}
                </p>
              )}
              <div className="d-flex gap-2 justify-content-end">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <motion.button
                  className="btn btn-gold"
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Placing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-1"></i> Confirm Order
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CartPage;