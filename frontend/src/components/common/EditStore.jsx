import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../api.js";

export default function EditStore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [expandedField, setExpandedField] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
     try {
  setLoading(true);
  const res = await api.get(`/stores/${id}`);
  setStore(res.data.store);
  setFormData(res.data.store);
} catch (err) {
        console.error("Failed to fetch store:", err);
        setError("❌ Failed to fetch store");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateStore = async () => {
    try {
      setLoading(true);
      const data = new FormData();

      [
        "name",
        "email",
        "address",
        "description",
        "category",
        "phone_no",
      ].forEach((field) => {
        if (formData[field] !== store[field]) {
          data.append(field, formData[field]);
        }
      });

      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await api.put(`/stores/${id}`, data, {
  headers: { "Content-Type": "multipart/form-data" },
});


      setStore(res.data.store);
      setFormData(res.data.store);
      setSuccessMsg("✅ Store updated successfully!");
      setEditingField(null);
      setImageFile(null);
      navigate("/my-stores");
    } catch (err) {
      console.error("Update failed:", err);
      setError("❌ Failed to update store");
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-muted">Loading...</p>;
  if (!store) return <p className="text-center text-danger">No store found</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="d-flex align-items-center mb-4">
          <div className="position-relative">
            <img
              src={formData.image_url || "https://via.placeholder.com/100"}
              alt="Store"
              className="rounded border border-3 border-primary"
              width="100"
              height="100"
              style={{ cursor: "pointer" }}
              onClick={() => setShowImagePopup(true)}
            />
          </div>

          <div className="ms-3">
            <h4 className="mb-0 fw-bold">{store.name}</h4>
            <small className="text-muted">#{store.id}</small>
            <p className="mb-0 text-secondary">{store.email || "No email"}</p>
          </div>

          <div className="ms-auto">
            {editingField === "image_url" ? (
              <div className="d-flex">
                <input
                  type="file"
                  className="form-control form-control-sm me-2"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleUpdateStore}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setEditingField("image_url")}
              >
                Edit Image
              </button>
            )}
          </div>
        </div>

        {showImagePopup && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
            onClick={() => setShowImagePopup(false)}
          >
            <div
              className="bg-white p-3 rounded shadow"
              style={{ maxWidth: "500px", position: "relative" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="btn-close position-absolute top-2 end-2"
                onClick={() => setShowImagePopup(false)}
              ></button>
              <img
                src={formData.image_url || "https://via.placeholder.com/400"}
                alt="Store Large"
                className="img-fluid rounded"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success alert-dismissible fade show">
            {successMsg}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMsg("")}
            ></button>
          </div>
        )}

        <div className="row g-4">
          {[
            "name",
            "email",
            "address",
            "description",
            "category",
            "phone_no",
          ].map((field) => {
            const isLongField = field === "description" || field === "address";
            const value = formData[field] || "";
            const LONG_THRESHOLD = 70;

            return (
              <div className="col-md-6" key={field}>
                <div className="d-flex justify-content-between align-items-start border rounded p-3 bg-light w-100">
                  <div className="flex-grow-1 me-3">
                    <label className="fw-semibold text-muted text-capitalize d-block mb-1">
                      {field.replace("_", " ")}
                    </label>

                    {editingField === field ? (
                      field === "category" ? (
                        <select
                          className="form-select"
                          name="category"
                          value={value}
                          onChange={handleChange}
                        >
                          <option value="restaurant">Restaurant</option>
                          <option value="clothing">Clothing</option>
                          <option value="electronics">Electronics</option>
                          <option value="grocery">Grocery</option>
                          <option value="pharmacy">Pharmacy</option>
                          <option value="others">Others</option>
                        </select>
                      ) : isLongField ? (
                        <textarea
                          className="form-control long-textarea"
                          name={field}
                          value={value}
                          onChange={handleChange}
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          name={field}
                          value={value}
                          onChange={handleChange}
                        />
                      )
                    ) : (
                      <>
                        <div
                          className={`long-text-box ${
                            isLongField && expandedField === field
                              ? "expanded"
                              : ""
                          }`}
                        >
                          {value || "—"}
                        </div>

                        {isLongField && value.length > LONG_THRESHOLD && (
                          <button
                            type="button"
                            className="btn btn-link p-0 mt-2"
                            onClick={() =>
                              setExpandedField(
                                expandedField === field ? null : field
                              )
                            }
                          >
                            {expandedField === field
                              ? "View Less"
                              : "View More"}
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {editingField === field ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleUpdateStore}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setEditingField(field)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="text-muted mb-0">
            Last updated:{" "}
            <span className="fw-semibold">
              {new Date(store.updated_at).toLocaleString()}
            </span>
          </p>
        </div>

        <div className="mt-4">
          <button
            className="btn btn-warning w-100 fw-bold"
            onClick={() => navigate("/my-stores")}
          >
            ⬅ Back to My Stores
          </button>
        </div>
      </div>
    </div>
  );
}
