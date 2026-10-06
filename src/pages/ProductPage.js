import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProductSearch from "./ProductSearch";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { imgSrc } from "../utils/format";

function ProductPage({ initialTerm = "" }) {
  const [keyword, setKeyword] = useState(initialTerm);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const fetchPageRef = useRef(null);

  useEffect(() => {
    setKeyword(initialTerm);
  }, [initialTerm]);

  const handleSearchResult = (data) => {
    const isArray = Array.isArray(data);
    const items = isArray ? data : (data || {}).items || [];
    const enriched = items.map((p, i) => ({
      ...p,
      id: `${p.TagNo || i}-${i}`,
      metal: p.MetalName,
    }));
    setProducts(enriched);
    setMeta(
      isArray
        ? { total: items.length, pages: 1, page: 1 }
        : {
            total: data.total || items.length,
            pages: data.pages || 1,
            page: data.page || 1,
          }
    );
    setLoading(false);
  };

  const goPage = (p) => {
    if (!fetchPageRef.current) return;
    fetchPageRef.current(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const from = meta.total ? (meta.page - 1) * 50 + 1 : 0;
  const to = Math.min(meta.page * 50, meta.total);

  return (
    <div className="product-page">
      {/* Hero */}
      <div className="site-hero">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="site-hero-title"> JewelSphere Online </h1>
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
        fetchPageRef={fetchPageRef}
      />

      <div className="products-section">
        <div className="results-head">
          <span className="results-label">All Designs</span>
          <span className="results-count">
            {loading
              ? "Loading..."
              : from && to
              ? meta.total > 50
                ? `Showing ${from}–${to} of ${meta.total} designs`
                : `${meta.total} designs`
              : "0 designs"}
          </span>
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
          <>
            <div className="row g-3 g-md-4 product-grid">
              {products.map((item) => (
                <div className="col-6 col-md-4 col-lg-3" key={item.id}>
                  <ProductCard item={item} imgSrc={imgSrc(item)} />
                </div>
              ))}
            </div>
            {meta.pages > 1 && (
              <Pagination page={meta.page} pages={meta.pages} onPage={goPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductPage;