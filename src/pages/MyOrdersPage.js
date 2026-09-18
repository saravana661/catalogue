import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import Loader from "../components/Loader";
import api from "../api/axios";

function MyOrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const { requireLogin } = useLoginModal();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) requireLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
    setLoading(true);
    api
      .get("/myOrders", { params: { email: user.email } })
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.email]);

  const fmtDate = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <i className="bi bi-box-seam empty-icon"></i>
          <h4>Sign in to view your orders</h4>
          <p>Please login to see your order history and details.</p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-gold px-4" onClick={() => requireLogin()}>
              <i className="bi bi-box-arrow-in-right me-2"></i> Login
            </button>
            <Link to="/" className="btn btn-outline-dark px-4">
              <i className="bi bi-arrow-left me-2"></i> Back to Store
            </Link>
          </div>
        </motion.div>
      </div>
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
          <i className="bi bi-bag-check me-2"></i> My Orders
          <span className="count-chip">{orders.length}</span>
        </h2>
        <Link to="/" className="btn btn-outline-dark btn-sm">
          <i className="bi bi-arrow-left me-1"></i> Continue Shopping
        </Link>
      </motion.div>

      {loading ? (
        <Loader message="Loading your orders..." />
      ) : orders.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <i className="bi bi-inbox empty-icon"></i>
          <h4>No orders yet</h4>
          <p>Once you place an order, it will appear here with full details.</p>
          <Link to="/" className="btn btn-gold px-4">
            <i className="bi bi-gem me-2"></i> Browse Designs
          </Link>
        </motion.div>
      ) : (
        <div className="orders-list">
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                className="order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  className="order-card-head"
                  onClick={() =>
                    setExpanded(expanded === order.id ? null : order.id)
                  }
                >
                  <div>
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">{fmtDate(order.createdAt)}</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="order-items-badge">
                      {order.totalItems} items
                    </span>
                    <i
                      className={`bi ${
                        expanded === order.id ? "bi-chevron-up" : "bi-chevron-down"
                      }`}
                    ></i>
                  </div>
                </button>

                <AnimatePresence>
                  {expanded === order.id && (
                    <motion.div
                      className="order-card-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      {order.remarks && (
                        <div className="order-remarks">
                          <i className="bi bi-chat-left-quote me-1"></i>
                          <strong>Remark:</strong> {order.remarks}
                        </div>
                      )}
                      <div className="table-responsive">
                        <table className="table table-sm align-middle order-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Design</th>
                              <th>Type</th>
                              <th>Metal</th>
                              <th>Tag No</th>
                              <th>Net Wt (g)</th>
                              <th>Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((it, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{it.SubProName}</td>
                                <td>{it.ProName || "-"}</td>
                                <td>{it.metal || "-"}</td>
                                <td>{it.TagNo || "-"}</td>
                                <td>{it.NetWt}</td>
                                <td>{it.qty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;