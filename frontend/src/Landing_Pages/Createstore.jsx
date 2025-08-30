import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createStore } from "../features/stores/StoresSlice";

export default function Createstore() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    store_name: "",
    email: "",
    address: "",
    phone_no: "",
    category: "restaurant",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [flash, setFlash] = useState({ type: "", message: "" });

  const categories = [
    "restaurant",
    "clothing",
    "electronics",
    "grocery",
    "pharmacy",
    "others",
  ];

  useEffect(() => {
    if (flash.message) {
      const timer = setTimeout(() => setFlash({ type: "", message: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);
    data.append("owner_id", user?.id);

    try {
      await dispatch(createStore(data)).unwrap();
      setFlash({
        type: "success",
        message: "✅ Store created successfully!",
      });
      setTimeout(() => navigate("/"), 1500);
    } catch (errMessage) {
      setFlash({
        type: "danger",
        message: String(errMessage),
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Create Store</h2>

        {flash.message && (
          <div
            className={`alert alert-${
              flash.type === "success" ? "success" : "danger"
            } alert-dismissible fade show`}
            role="alert"
          >
            {flash.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setFlash({ type: "", message: "" })}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Store Name</label>
            <input
              type="text"
              className="form-control"
              name="store_name"
              value={formData.store_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone No</label>
            <input
              type="text"
              className="form-control"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="form-control"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4">
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
