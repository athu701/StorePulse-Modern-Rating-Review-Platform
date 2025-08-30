import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "./AuthSlice";

export default function SignupForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [flash, setFlash] = useState({ type: "", message: "", visible: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const showFlash = (type, message) => {
    setFlash({ type, message, visible: true });
    setTimeout(() => {
      setFlash((prev) => ({ ...prev, visible: false }));
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (imageFile) formData.append("image", imageFile);

      const res = await dispatch(signup(formData)).unwrap();

      setLoading(false);
      showFlash("success", res.message || "Signup successful! 🎉");

      if (onSuccess) onSuccess(true, res.message || "Signup successful! 🎉");
    } catch (err) {
      setLoading(false);
      const backendMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed. Please try again.";
      showFlash("error", backendMsg);

      if (onSuccess) onSuccess(false, backendMsg);
    }
  };

  return (
    <form className="p-4" onSubmit={handleSubmit} encType="multipart/form-data">
      {flash.visible && (
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
            onClick={() => setFlash((prev) => ({ ...prev, visible: false }))}
          />
        </div>
      )}

      {Object.keys(form).map((key) =>
        key === "password" ? (
          <div className="mb-3" key={key}>
            <label htmlFor={key}>Password</label>
            <div className="input-group">
              <input
                id={key}
                className="form-control"
                type={showPassword ? "text" : "password"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-3" key={key}>
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
            </label>
            <input
              id={key}
              className="form-control"
              type={key === "email" ? "email" : "text"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
            />
          </div>
        )
      )}

      <div className="mb-3">
        <label htmlFor="image">Profile Image</label>
        <input
          id="image"
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-success" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
