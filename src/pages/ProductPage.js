import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductSearch from "./ProductSearch";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function ProductPage({ initialTerm = "" }) {
  const [keyword, setKeyword] = useState(initialTerm);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState("");

  useEffect(() => {
    setKeyword(initialTerm);
  }, [initialTerm]);

  const handleSearchResult = (data, filterLabel) => {
    const enriched = (data || []).map((p, i) => ({
      ...p,
      id: `${p.TagNo || i}-${i}`,
      metal: p.MetalName,
    }));
    setProducts(enriched);
    setLoading(false);
    if (filterLabel) setActiveFilters(filterLabel);
  };

  const resultLabel =
    activeFilters && activeFilters !== "All"
      ? `Showing: ${activeFilters}`
      : "All Designs";

  return (
    <div className="product-page">
      {/* Hero */}
      <div className="site-hero">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="site-hero-title">JewelSphere Online</h1>
          <p>Explore timeless gold, silver, diamond & platinum designs</p>
        </motion.div>
        <motion.div
          className="site-hero-gem"
          animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          ◆
        </motion.div>
      </div>

      <ProductSearch
        onSearchResult={handleSearchResult}
        onSearchStart={() => setLoading(true)}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />

      <div className="products-section">
        <div className="results-head">
          <span className="results-label">{resultLabel}</span>
          <span className="results-count">{products.length} designs</span>
        </div>

        {loading ? (
          <Loader message="Polishing your jewellery designs..." />
        ) : products.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <i className="bi bi-emoji-frown empty-icon"></i>
            <h5>No designs found</h5>
            <p>Try adjusting your filters or refreshing the catalogue.</p>
          </motion.div>
        ) : (
          <div className="row g-3 g-md-4 product-grid">
            {products.map((item) => (
              <div className="col-6 col-md-4 col-lg-3" key={item.id}>
                <ProductCard
                  item={item}
                  imgSrc={
                    item.ImageBase64
                      ? `data:image/jpeg;base64,${item.ImageBase64}`
                      : null
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;