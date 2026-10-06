// Persist cart/wishlist items WITHOUT huge base64 images (a ~400KB image per
// item blows the ~5MB localStorage quota). A tiny canvas thumbnail is kept so
// images still render after a page reload.

const stripImage = (item) => {
  if (!item) return item;
  const copy = { ...item };
  delete copy.ImageBase64;
  return copy;
};

const makeThumb = (item) =>
  new Promise((resolve) => {
    if (!item || !item.ImageBase64) {
      resolve(stripImage(item));
      return;
    }
    const img = new Image();
    const done = (thumbB64) => {
      const copy = stripImage(item);
      if (thumbB64) copy.ImageBase64 = thumbB64;
      resolve(copy);
    };
    img.onload = () => {
      try {
        const MAX = 140;
        const scale = Math.min(
          1,
          MAX / Math.max(img.width || 1, img.height || 1)
        );
        const w = Math.max(1, Math.round((img.width || 1) * scale));
        const h = Math.max(1, Math.round((img.height || 1) * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          done(null);
          return;
        }
        ctx.imageSmoothingEnabled = true;
        if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);
        const data = canvas.toDataURL("image/jpeg", 0.7);
        done(data.split(",")[1]);
      } catch (e) {
        done(null);
      }
    };
    img.onerror = () => done(null);
    img.src = "data:image/jpeg;base64," + item.ImageBase64;
  });

const writeSeq = new Map();
let seqCounter = 0;

// Store a lightweight copy. Falls back to no-image data if even the thumbs
// exceed the quota, so adding to wishlist/cart NEVER throws.
export const persistItems = async (key, items) => {
  const seq = ++seqCounter;
  writeSeq.set(key, seq);
  const storable = await Promise.all(items.map(makeThumb));
  if (writeSeq.get(key) !== seq) return; // superseded by a newer write
  try {
    localStorage.setItem(key, JSON.stringify(storable));
  } catch (e) {
    try {
      localStorage.setItem(key, JSON.stringify(items.map(stripImage)));
    } catch (e2) {
      /* quota still exceeded — skip persisting entirely */
    }
  }
};