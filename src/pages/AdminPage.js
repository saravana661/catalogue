import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { formatTag } from "../utils/format";
import AdminImages from "../components/AdminImages";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123"; // local fallback when API/DB is unreachable

const ORDER_STATUSES = ["Order Placed", "Work in Progress", "Shipped", "Delivered"];

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(
    () => sessionStorage.getItem("pothysAdmin") === "1"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [tab, setTab] = useState("orders");

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    api
      .get("/orders")
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [loggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const res = await api.post("/adminLogin", {
        email: username.trim(),
        password,
      });
      if (res.data.role === "admin") {
        sessionStorage.setItem("pothysAdmin", "1");
        setLoggedIn(true);
      } else {
        // Fallback: local hardcoded admin when API/DB unreachable
        if (username === ADMIN_USER && password === ADMIN_PASS) {
          sessionStorage.setItem("pothysAdmin", "1");
          setLoggedIn(true);
        } else {
          setError("Invalid admin credentials");
        }
      }
    } catch (err) {
      // 401 from server, or network/server down
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem("pothysAdmin", "1");
        setLoggedIn(true);
      } else {
        setError(
          err.response?.data?.error ||
            "Server unreachable. Check credentials or start the server."
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("pothysAdmin");
    setLoggedIn(false);
    setOrders([]);
  };

  const handleStatusChange = async (order, status) => {
    const prev = orders;
    setUpdatingStatus(order.id);
    setOrders((list) =>
      list.map((o) => (o.id === order.id ? { ...o, status } : o))
    );
    try {
      const res = await api.patch(`/orders/${order.id}/status`, { status });
      if (res.data.status !== status) throw new Error("response mismatch");
    } catch (err) {
      setOrders(prev);
      alert("Failed to update status: " + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingStatus(null);
    }
  };

  const fmtDate = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso;
    }
  };

  if (!loggedIn) {
    return (
      <div className="admin-login-wrap">
        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <div className="admin-login-icon">
            <i className="bi bi-shield-lock"></i>
          </div>
          <h3>Admin Login</h3>
          <p className="text-muted small">
            Access the order details dashboard
          </p>

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <i className="bi bi-person"></i>
              <input
                type="text"
                placeholder="Admin Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              className="login-btn"
              disabled={busy}
            >
              {busy ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Checking...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i> Login
                </>
              )}
            </motion.button>
          </form>

          <Link to="/" className="btn btn-link text-muted mt-3 w-100">
            <i className="bi bi-arrow-left me-1"></i> Back to Store
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-head">
        <div>
          <h2>
            <i className="bi bi-clipboard-data me-2"></i> {tab === "images" ? "Image Manager" : "Order Details"}
          </h2>
          <p className="text-muted small mb-0">
            {tab === "images"
              ? "Manage product images used in the catalogue"
              : `${orders.length} order(s) received`}
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-dark btn-sm">
            <i className="bi bi-shop me-1"></i> Store
          </Link>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === "orders" ? "active" : ""}`}
          onClick={() => setTab("orders")}
        >
          <i className="bi bi-clipboard-data me-1"></i> Orders
        </button>
        <button
          className={`admin-tab ${tab === "images" ? "active" : ""}`}
          onClick={() => setTab("images")}
        >
          <i className="bi bi-images me-1"></i> Image Manager
        </button>
      </div>

      {tab === "images" ? (
        <AdminImages />
      ) : loading ? (
        <div className="app-loader">
          <div className="loader-ring">
            <span className="loader-gem">◆</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <i className="bi bi-inbox empty-icon"></i>
          <h4>No orders yet</h4>
          <p>Orders placed from the store will appear here.</p>
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
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div>
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">{fmtDate(order.createdAt)}</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="order-customer">
                      <i className="bi bi-person me-1"></i>
                      {order.customer?.name || "Guest"}
                    </span>
                    <span className="order-items-badge">{order.totalItems} items</span>
                    <i
                      className={`bi ${expanded === order.id ? "bi-chevron-up" : "bi-chevron-down"}`}
                    ></i>
                  </div>
                </button>

                <div className="order-card-statusbar">
                  <span className="statusbar-label">Status</span>
                  <select
                    className={`status-select status-${String(order.status || "Order Placed")
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    value={order.status || "Order Placed"}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {updatingStatus === order.id && (
                    <span className="statusbar-updating">
                      <i className="bi bi-arrow-repeat me-1"></i>saving...
                    </span>
                  )}
                </div>

                <AnimatePresence>
                  {expanded === order.id && (
                    <motion.div
                      className="order-card-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="order-meta">
                        {order.customer?.email && (
                          <span>
                            <i className="bi bi-envelope me-1"></i>
                            {order.customer.email}
                          </span>
                        )}
                        {order.customer?.provider && (
                          <span>
                            <i className="bi bi-google me-1"></i>
                            {order.customer.provider}
                          </span>
                        )}
                      </div>
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
                              <th>Pref Wt</th>
                              <th>Pref Size</th>
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
                                <td>{formatTag(it.TagNo) || "-"}</td>
                                <td>{it.NetWt}</td>
                                <td>{it.preferredWt || "-"}</td>
                                <td>{it.preferredSize || "-"}</td>
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

export default AdminPage;