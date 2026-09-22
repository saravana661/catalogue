import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatTag } from "../utils/format";

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

function ProductLightbox({ item, imgSrc, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0 });
  const imgWrapRef = useRef(null);

  // Lock body scroll + Escape key + wheel zoom
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const wrap = imgWrapRef.current;
    const onWheel = (e) => {
      if (e.deltaY < 0) setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.2).toFixed(2)));
      else setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.2).toFixed(2)));
      e.preventDefault();
    };
    if (wrap) wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (wrap) wrap.removeEventListener("wheel", onWheel);
    };
  }, [onClose]);

  const changeZoom = (factor) =>
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z + factor).toFixed(2))));

  const onPointerDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    dragRef.current = { startX: e.clientX - pan.x, startY: e.clientY - pan.y };
    e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging || zoom <= 1) return;
    setPan({ x: e.clientX - dragRef.current.startX, y: e.clientY - dragRef.current.startY });
  };
  const onPointerUp = () => setDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="lightbox-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lightbox-top">
            <div className="lightbox-title">
              <h5>{item.SubProName}</h5>
              <span>
                <i className="bi bi-tag me-1"></i>
                {formatTag(item.TagNo)}
              </span>
            </div>
            <button className="lightbox-close" onClick={onClose} aria-label="close zoom">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div
            ref={imgWrapRef}
            className="lightbox-img-wrap"
            onDoubleClick={() => (zoom > 1 ? resetView() : changeZoom(1.5))}
          >
            {imgSrc ? (
              <>
                {!loaded && (
                  <div className="img-skeleton">
                    <span className="skeleton-glow"></span>
                  </div>
                )}
                <img
                  src={imgSrc}
                  alt={item.SubProName}
                  className={loaded ? "loaded" : ""}
                  onLoad={() => setLoaded(true)}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerLeave={onPointerUp}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    cursor: zoom > 1 ? "grab" : "zoom-in",
                  }}
                  draggable={false}
                />
                <div className="zoom-pill">
                  <i className="bi bi-zoom-in"></i> {Math.round(zoom * 100)}%
                </div>
              </>
            ) : (
              <div className="img-placeholder-lg">
                <i className="bi bi-gem"></i>
                <p>No image available for this design.</p>
              </div>
            )}
          </div>

          <div className="lightbox-foot">
            <div className="lightbox-meta">
              <span>
                <i className="bi bi-diagram-3"></i> {item.ProName}
              </span>
              <span>
                <i className="bi bi-bounding-box"></i> Net Wt: {item.NetWt} g
              </span>
              <span>
                <i className="bi bi-gem"></i> {item.MetalName}
              </span>
            </div>
            <div className="lightbox-controls">
              <button onClick={() => changeZoom(-0.5)} disabled={zoom <= MIN_ZOOM} aria-label="zoom out">
                <i className="bi bi-zoom-out"></i>
              </button>
              <span className="zoom-value">{Math.round(zoom * 100)}%</span>
              <button onClick={() => changeZoom(0.5)} disabled={zoom >= MAX_ZOOM} aria-label="zoom in">
                <i className="bi bi-zoom-in"></i>
              </button>
              <button onClick={resetView} className="zoom-reset" aria-label="reset zoom">
                <i className="bi bi-arrows-fullscreen"></i>
              </button>
            </div>
            <p className="lightbox-hint">
              <i className="bi bi-mouse"></i> Scroll to zoom • drag to pan • double-click to toggle
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProductLightbox;