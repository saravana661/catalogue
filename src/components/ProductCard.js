import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useLoginModal } from "../context/LoginModalContext";

function ProductCard({ item, imgSrc }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isLiked, toggleLike } = useWishlist();
  const { requireLogin } = useLoginModal();

  const [pumped, setPumped] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const liked = isLiked(item.id);

  const doLike = () => {
    toggleLike(item);
    setPumped(true);
    setTimeout(() => setPumped(false), 600);
  };

  const handleLike = () => {
    if (isAuthenticated) doLike();
    else requireLogin(doLike);
  };

  const doAdd = () => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleAdd = () => {
    if (isAuthenticated) doAdd();
    else requireLogin(doAdd);
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div className="product-img-wrap">
        {imgSrc ? (
          <>
            {!imgLoaded && (
              <div className="img-skeleton">
                <span className="skeleton-glow"></span>
              </div>
            )}
            <img
              src={imgSrc}
              alt={item.SubProName}
              className={`product-card-img ${imgLoaded ? "loaded" : ""}`}
              onLoad={() => setImgLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="img-placeholder">
            <i className="bi bi-gem"></i>
          </div>
        )}

        {item.MetalName && <span className="product-badge">{item.MetalName}</span>}

        {/* Like button with heart pump */}
        <button
          className={`like-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
          aria-label="wishlist"
        >
          <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`}></i>
        </button>

        {/* Heart pump burst */}
        <AnimatePresence>
          {pumped && (
            <motion.div
              className="heart-burst"
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <i className="bi bi-heart-fill"></i>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="product-card-body">
        <h6 className="product-name">{item.SubProName}</h6>
        <div className="product-meta">
          {item.ProName && (
            <span>
              <i className="bi bi-diagram-3"></i> {item.ProName}
            </span>
          )}
          <span>
            <i className="bi bi-bounding-box"></i> Net Wt: {item.NetWt} g
          </span>
          <span>
            <i className="bi bi-tag"></i> {item.TagNo}
          </span>
        </div>

        <motion.button
          className={`add-btn ${added ? "added" : ""}`}
          whileTap={{ scale: 0.9 }}
          onClick={handleAdd}
        >
          {added ? (
            <>
              <i className="bi bi-check-circle-fill"></i> Added!
            </>
          ) : (
            <>
              <i className="bi bi-bag-plus"></i> Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProductCard;