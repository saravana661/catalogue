// Strip the "POT" prefix from tag numbers for display (kept in DB untouched)
export const formatTag = (tag) => (tag ? String(tag).replace(/^POT/i, "") : "");

// API host (scheme + host + port) derived from the axios base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
export const API_HOST = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

// Resolve a product's image source: folder URL >> legacy base64 >> null
export const imgSrc = (item) => {
  if (!item) return null;
  if (item.imageUrl) return API_HOST + item.imageUrl;
  if (item.ImageBase64) return `data:image/jpeg;base64,${item.ImageBase64}`;
  return null;
};