import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminPage from "./pages/AdminPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppInner() {
  const [globalSearch, setGlobalSearch] = useState("");

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <div className="page-shell">
                <Navbar searchTerm={globalSearch} onSearch={setGlobalSearch} />
                <div className="Main">
                  <ProductPage initialTerm={globalSearch} />
                </div>
                <Footer />
              </div>
            }
          />   

          <Route
            path="/cart"
            element={
              <div className="page-shell">
                <Navbar searchTerm={globalSearch} onSearch={setGlobalSearch} />
                <div className="Main">
                  <CartPage />
                </div>
                <Footer />
              </div>
            }
          />

          <Route
            path="/wishlist"
            element={
              <div className="page-shell">
                <Navbar searchTerm={globalSearch} onSearch={setGlobalSearch} />
                <div className="Main">
                  <WishlistPage />
                </div>
                <Footer />
              </div>
            }
          />

          <Route
            path="/my-orders"
            element={
              <div className="page-shell">
                <Navbar searchTerm={globalSearch} onSearch={setGlobalSearch} />
                <div className="Main">
                  <MyOrdersPage />
                </div>
                <Footer />
              </div>  
            }
          />

          <Route
            path="/admin"
            element={
              <div>
                <AdminPage />
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return <AppInner />;
}

export default App;