import axios from "axios";

// ─── Single place for the backend API base URL ──────────────────────────
// To switch environments, edit ONLY the .env file in the Catalogue folder:
//
//   .env           ->  REACT_APP_API_URL=http://localhost:5000/api   (local)
//   .env.local     ->  REACT_APP_API_URL=https://your-live-domain/api (live)
//
// .env.local overrides .env, so you can keep your live URL in
// .env.local without touching the committed .env. No code changes needed.
// ─────────────────────────────────────────────────────────────────────────
//http://localhost:5000/api
//https://kalash.app/api
const BASE_URL ="http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;