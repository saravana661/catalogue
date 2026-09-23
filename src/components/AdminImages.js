import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { imgSrc } from "../utils/format";

function AdminImages() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    TagNo: "",
    SubProName: "",
    ProName: "",
    MetalName: "",
    NetWt: "",
    file: null,
  });

  const load = (keyword = "") => {
    setLoading(true);
    api
      .get("/admin/images", { params: keyword ? { q: keyword } : {} })
      .then((res) => setList(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("TagNo", form.TagNo.trim());
      fd.append("SubProName", form.SubProName.trim());
      fd.append("ProName", form.ProName.trim());
      fd.append("MetalName", form.MetalName.trim());
      fd.append("NetWt", form.NetWt.trim());
      if (form.file) fd.append("file", form.file);
      await api.post("/admin/images", fd);
      setForm({ TagNo: "", SubProName: "", ProName: "", MetalName: "", NetWt: "", file: null });
      setShowForm(false);
      setQ("");
      load();
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (row) => {
    try {
      await api.patch(`/admin/images/${row.id}/active`, { active: !row.IsActive });
      load(q);
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || err.message));
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete image for Tag ${row.TagNo}?`)) return;
    try {
      await api.delete(`/admin/images/${row.id}`);
      load(q);
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <div className="admin-images-head">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <input
            className="admin-search"
            placeholder="Search TagNo / name..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-dark btn-sm" onClick={() => load(q)}>
            <i className="bi bi-search me-1"></i> Search
          </button>
          <button className="btn btn-gold btn-sm" onClick={() => setShowForm(!showForm)}>
            <i className="bi bi-plus-lg me-1"></i> Add / Upload Image
          </button>
        </div>
      </div>

      {showForm && (
        <motion.form
          className="admin-img-form"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submitForm}
        >
          <div className="row g-2">
            <div className="col-md-3">
              <input
                className="admin-input"
                placeholder="TagNo *"
                value={form.TagNo}
                onChange={(e) => setForm({ ...form, TagNo: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                className="admin-input"
                placeholder="Sub Product Name"
                value={form.SubProName}
                onChange={(e) => setForm({ ...form, SubProName: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                className="admin-input"
                placeholder="Product Type"
                value={form.ProName}
                onChange={(e) => setForm({ ...form, ProName: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                className="admin-input"
                placeholder="Metal"
                value={form.MetalName}
                onChange={(e) => setForm({ ...form, MetalName: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                className="admin-input"
                type="text"
                inputMode="decimal"
                placeholder="Net Wt"
                value={form.NetWt}
                onChange={(e) => setForm({ ...form, NetWt: e.target.value })}
              />
            </div>
            <div className="col-md-8">
              <input
                className="admin-file"
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
              />
            </div>
            <div className="col-md-4 d-flex gap-2">
              <button className="btn btn-gold w-100" type="submit" disabled={busy}>
                {busy ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>Uploading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-upload me-1"></i> Save
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="app-loader py-5">
          <div className="loader-ring">
            <span className="loader-gem">◆</span>
          </div>
        </div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-images empty-icon"></i>
          <h4>No images found</h4>
          <p>Use "Add / Upload Image" or run the extraction process.</p>
        </div>
      ) : (
        <div className="admin-img-grid">
          {list.map((row) => (
            <motion.div
              key={row.id}
              className={`admin-img-card ${row.IsActive ? "" : "inactive"}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="admin-img-thumb">
                {imgSrc(row) ? (
                  <img src={imgSrc(row)} alt={row.TagNo} loading="lazy" />
                ) : (
                  <span className="admin-img-no">No file</span>
                )}
                <span className={`admin-img-state ${row.IsActive ? "on" : "off"}`}>
                  {row.IsActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="admin-img-body">
                <div className="admin-img-tag">{fetchDisplayTag(row.TagNo)}</div>
                <div className="admin-img-name">{row.SubProName || "—"}</div>
                <div className="admin-img-meta">
                  {row.ProName && <span>{row.ProName}</span>}
                  {row.MetalName && <span>{row.MetalName}</span>}
                  {row.NetWt != null && <span>{row.NetWt} g</span>}
                </div>
                <div className="admin-img-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => toggleActive(row)}>
                    <i className={`bi ${row.IsActive ? "bi-eye-slash" : "bi-eye"} me-1`}></i>
                    {row.IsActive ? "Hide" : "Show"}
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(row)}>
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

const fetchDisplayTag = (tag) => String(tag || "").replace(/^POT/i, "");

export default AdminImages;