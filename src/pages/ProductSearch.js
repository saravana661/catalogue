import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";

// Fixed catalogue category chips (GOLD by MetalCode, rest by product name LIKE)
// pro/nopro accept comma-separated keywords (OR'd includes / AND NOT excludes)
const CATEGORIES = [
  { label: "GOLD", param: "metal", value: "G" },
  { label: "DIAMOND", param: "pro", value: "DIA", nopro: "DIAL" },
  { label: "EARRINGS", param: "pro", value: "EARRING,EAR RING,EAR STUD,EARSTUD" },
  { label: "RINGS", param: "pro", value: "RING", nopro: "EARRING,EAR RING" },
  { label: "PENDANTS", param: "pro", value: "PENDANT" },
  { label: "NECKLACES", param: "pro", value: "NECKLACE" },
  { label: "THALI CHAINS", param: "pro", value: "THALI", noImg: true },
  { label: "COINS AND BARS", param: "pro", value: "COIN,BAR", nopro: "MALABAR,SOUND", noImg: true },
];

function ProductSearch({ onSearchResult, keyword, onKeywordChange }) {
  const [activeCat, setActiveCat] = useState("");

  const [fromWt, setFromWt] = useState("");
  const [toWt, setToWt] = useState("");
  const [tag, setTag] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef(null);

  const runSearch = (overrides = {}) => {
    const params = new URLSearchParams();
    const cat = overrides.cat !== undefined ? overrides.cat : activeCat;
    const chip = CATEGORIES.find((c) => c.label === cat);
    if (keyword) params.append("name", keyword);
    if (chip) {
      params.append(chip.param, chip.value);
      if (chip.nopro) params.append("nopro", chip.nopro);
      if (chip.noImg) params.append("noImg", "1");
    }
    if (fromWt) params.append("fromWt", fromWt);
    if (toWt) params.append("toWt", toWt);
    if (tag) params.append("tag", tag);

    setLoading(true);
    api.get("/goldProducts/search", { params })
      .then((res) => onSearchResult(res.data || []))
      .catch(() => {
        setError("Could not fetch products. Is the server running?");
        onSearchResult([]);
      })
      .finally(() => setLoading(false));
  };

  // Debounce keyword typing from navbar search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch();
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const handleCat = (c) => {
    setActiveCat(c);
    runSearch({ cat: c });
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    runSearch();
  };

  const clearFilters = () => {
    setActiveCat("");
    setFromWt("");
    setToWt("");
    setTag("");
    onKeywordChange("");
    onSearchResult([]);
  };

  const FilterRow = ({ children, label }) => (
    <div className="filter-field">
      <label>{label}</label>
      {children}
    </div>
  );

  return (
    <div>
      {/* Category chips */}
      <div className="chip-block">
        <span className="chip-label">
          <i className="bi bi-gem me-1"></i> Browse
        </span>
        <div className="chip-row-cat">
          <button
            className={`chip ${activeCat === "" ? "chip-active" : ""}`}
            onClick={() => handleCat("")}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              className={`chip ${activeCat === c.label ? "chip-active" : ""}`}
              onClick={() => handleCat(c.label)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      <motion.div
        className="filter-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSearchClick}>
          <div className="filter-grid">
            <FilterRow label="Keyword">
              <div className="input-icon">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={keyword}
                  onChange={(e) => onKeywordChange(e.target.value)}
                />
              </div>
            </FilterRow>

            <FilterRow label="Tag No">
              <input
                type="text"
                placeholder="e.g. POT22H50001"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </FilterRow>

            <FilterRow label="Weight From (g)">
              <input
                type="number"
                step="0.001"
                placeholder="0"
                value={fromWt}
                onChange={(e) => setFromWt(e.target.value)}
              />
            </FilterRow>

            <FilterRow label="Weight To (g)">
              <input
                type="number"
                step="0.001"
                placeholder="0"
                value={toWt}
                onChange={(e) => setToWt(e.target.value)}
              />
            </FilterRow>
          </div>

          <div className="filter-actions">
            <motion.button
              className="btn btn-search"
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Searching...
                </>
              ) : (
                <>
                  <i className="bi bi-funnel me-2"></i> Apply Filters
                </>
              )}
            </motion.button>
            <motion.button
              className="btn btn-clear"
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
            >
              <i className="bi bi-x-circle me-2"></i> Reset
            </motion.button>
          </div>
        </form>

        {error && (
          <div className="filter-error">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ProductSearch;