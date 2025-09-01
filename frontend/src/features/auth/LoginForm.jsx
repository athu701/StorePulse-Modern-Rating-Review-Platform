import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./AuthSlice";
import { Link } from "react-router-dom";

export default function LoginForm({ onSuccess, onCancel }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [flash, setFlash] = useState({ type: "", message: "", visible: false });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const showFlash = (type, message) => {
    setFlash({ type, message, visible: true });
    setTimeout(() => setFlash({ ...flash, visible: false }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFlash({ type: "", message: "", visible: false });
    setLoading(true);

    try {
      const user = await dispatch(login({ email, password })).unwrap();
      setLoading(false);
      showFlash("success", "Login successful! 🎉");
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      showFlash("error", err.message || "Login failed. Please try again.");
    }
  };

  return (
    <form className="p-4" onSubmit={handleSubmit}>
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
            onClick={() => setFlash({ ...flash, visible: false })}
          />
        </div>
      )}

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
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

      {/* <div className="text-center">
        <span>Don’t have an account? </span>
        <Link
          to="/signup"
          className="btn btn-outline-success rounded-pill px-4 py-2 shadow-sm"
        >
          ✨ Sign Up
        </Link>
      </div> */}
    </form>
  );
}
