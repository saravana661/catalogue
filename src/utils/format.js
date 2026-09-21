// Strip the "POT" prefix from tag numbers for display (kept in DB untouched)
export const formatTag = (tag) => (tag ? String(tag).replace(/^POT/i, "") : "");