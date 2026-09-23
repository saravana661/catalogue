import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

// Fixed catalogue category chips (product name LIKE filters)
// pro/nopro accept comma-separated keywords (OR'd includes / AND NOT excludes)
const CATEGORIES = [
  { label: "EARRINGS", param: "pro", value: "EARRING,EAR RING,EAR STUD,EARSTUD" },
  { label: "RINGS", param: "pro", value: "RING", nopro: "EARRING,EAR RING" },
  { label: "PENDANTS", param: "pro", value: "PENDANT" },
  { label: "NECKLACES", param: "pro", value: "NECKLACE" },
 // { label: "THALI CHAINS", param: "pro", value: "THALI", noImg: true },
  //{ label: "COINS AND BARS", param: "pro", value: "COIN,BAR", nopro: "MALABAR,SOUND", noImg: true },
];

// NOTE: must be module-scope, never defined inside the component render.
// Defining a component inside the render body gives it a new identity on every
// render, which makes React unmount + remount its subtree — that's what made
// inputs lose focus after every keystroke.
const FilterRow = ({ children, label }) => (
  <div className="filter-field">
    <label>{label}</label>
    {children}
  </div>
);

function ProductSearch({ onSearchResult, keyword, onKeywordChange, onSearchStart }) {
  const [activeCat, setActiveCat] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [fromWt, setFromWt] = useState("");
  const [toWt, setToWt] = useState("");
  const [tag, setTag] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceRef = useRef(null);

  const runSearch = (overrides = {}) => {
    const params = new URLSearchParams();
    const cat = overrides.cat !== undefined ? overrides.cat : activeCat;
    const from = overrides.fromWt !== undefined ? overrides.fromWt : fromWt;
    const to = overrides.toWt !== undefined ? overrides.toWt : toWt;
    const tg = overrides.tag !== undefined ? overrides.tag : tag;
    const kw = overrides.keyword !== undefined ? overrides.keyword : keyword;
    const chip = CATEGORIES.find((c) => c.label === cat);
    if (kw) params.append("name", kw);
    if (chip) {
      params.append(chip.param, chip.value);
      if (chip.nopro) params.append("nopro", chip.nopro);
      if (chip.noImg) params.append("noImg", "1");
    }
    if (from) params.append("fromWt", from);
    if (to) params.append("toWt", to);
    if (tg) params.append("tag", tg);

    setLoading(true);
    if (onSearchStart) onSearchStart();
    api
      .get("/goldProducts/search", { params })
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

  // Desktop: chip click searches immediately
  const handleCat = (c) => {
    setActiveCat(c);
    runSearch({ cat: c });
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    runSearch();
  };

  // Mobile sidebar: apply runs the search and closes the drawer
  const applyAndClose = () => {
    runSearch();
    setDrawerOpen(false);
  };

  const clearFilters = () => {
    setActiveCat("");
    setFromWt("");
    setToWt("");
    setTag("");
    onKeywordChange("");
    // Reload the full catalogue (all chips / All designs) — no filters
    runSearch({ cat: "", fromWt: "", toWt: "", tag: "", keyword: "" });
  };

  const hasActiveFilter =
    activeCat || tag || fromWt || toWt || keyword;

  const renderChips = (action) => (
    <div className="chip-block">
      <span className="chip-label">
        <i className="bi bi-gem me-1"></i> Browse
      </span>
      <div className="chip-row-cat">
        <button
          className={`chip ${activeCat === "" ? "chip-active" : ""}`}
          onClick={() => action("")}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            className={`chip ${activeCat === c.label ? "chip-active" : ""}`}
            onClick={() => action(c.label)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFields = () => (
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
          type="text"
          inputMode="decimal"
          placeholder="Min"
          value={fromWt}
          onChange={(e) => setFromWt(e.target.value.replace(/[^0-9.]/g, ""))}
        />
      </FilterRow>

      <FilterRow label="Weight To (g)">
        <input
          type="text"
          inputMode="decimal"
          placeholder="Max"
          value={toWt}
          onChange={(e) => setToWt(e.target.value.replace(/[^0-9.]/g, ""))}
        />
      </FilterRow>
    </div>
  );

  const errorBox = error ? (
    <div className="filter-error">
      <i className="bi bi-exclamation-triangle me-2"></i>
      {error}
    </div>
  ) : null;

  return (
    <div className="product-search-wrap">
      {/* ================= DESKTOP (inline, instant) ================= */}
      <div className="filter-inline">
        {renderChips(handleCat)}

        <motion.div
          className="filter-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSearchClick}>
            {renderFields()}

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
          {errorBox}
        </motion.div>
      </div>

      {/* ================= MOBILE: filters button ================= */}
      <div className="mobile-filter-bar">
        <motion.button
          className="mobile-filter-btn"
          whileTap={{ scale: 0.95 }}
          onClick={() => setDrawerOpen(true)}
        >
          <i className="bi bi-funnel me-2"></i> Filters
          {hasActiveFilter && <span className="filter-dot"></span>}
        </motion.button>
      </div>

      {/* ================= MOBILE: slide-in sidebar ================= */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            ></motion.div>

            <motion.aside
              className="filter-drawer"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="drawer-head">
                <h5>
                  <i className="bi bi-funnel me-2"></i> Filters
                </h5>
                <button
                  className="drawer-close"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="close filters"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="drawer-body">
                {renderChips((c) => setActiveCat(c))}
                <div className="drawer-section-title">Refine</div>
                {renderFields()}
                {errorBox}
              </div>

              <div className="drawer-foot">
                <motion.button
                  className="btn btn-clear"
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                >
                  <i className="bi bi-x-circle me-2"></i> Reset
                </motion.button>
                <motion.button
                  className="btn btn-search"
                  whileTap={{ scale: 0.95 }}
                  onClick={applyAndClose}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Applying...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i> Apply Filters
                    </>
                  )}
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductSearch;