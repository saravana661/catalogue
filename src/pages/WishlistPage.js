import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { formatTag, imgSrc } from "../utils/format";
import { useLoginModal } from "../context/LoginModalContext";

function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { requireLogin } = useLoginModal();
  const { wishlist, toggleLike } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!isAuthenticated) requireLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveToCart = (item) => {
    if (!isAuthenticated) {
      requireLogin(() => addToCart(item));
      return;
    }
    addToCart(item);
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>
          <i className="bi bi-heart-fill text-danger me-2"></i> My Wishlist
          <span className="count-chip">{wishlist.length}</span>
        </h2>
      </motion.div>

      {wishlist.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.i
            className="bi bi-heartbreak empty-icon"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          ></motion.i>
          <h4>No favourites yet</h4>
          <p>Tap the heart on any design to save it here.</p>
          <Link to="/" className="btn btn-dark px-4">
            <i className="bi bi-arrow-left me-2"></i> Explore Designs
          </Link>
        </motion.div>
      ) : (
        <div className="row g-4">
          <AnimatePresence>
            {wishlist.map((item) => (
              <motion.div
                className="col-6 col-md-4 col-lg-3"
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div className="product-card" whileHover={{ y: -10 }}>
                  <div className="product-img-wrap">
                    {imgSrc(item) && (
                      <img
                        src={imgSrc(item)}
                        alt={item.SubProName}
                        className="product-card-img loaded"
                        loading="lazy"
                      />
                    )}
                    {item.MetalName && (
                      <span className="product-badge">{item.MetalName}</span>
                    )}
                    <button
                      className="like-btn liked"
                      onClick={() => toggleLike(item)}
                      aria-label="remove from wishlist"
                    >
                      <i className="bi bi-heart-fill"></i>
                    </button>
                  </div>
                  <div className="product-card-body">
                    <h6 className="product-name">{item.SubProName}</h6>
                    <div className="product-meta">
                      {item.ProName && (
                        <span>
                          <i className="bi bi-diagram-3"></i> {item.ProName}
                        </span>
                      )}
                      <span>Net Wt: {item.NetWt} g</span>
                      <span className="text-muted">
                        <i className="bi bi-tag me-1"></i>
                        {formatTag(item.TagNo)}
                      </span>
                    </div>
                    <motion.button
                      className="add-btn w-100"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => moveToCart(item)}
                    >
                      <i className="bi bi-bag-plus me-1"></i> Move to Cart
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;