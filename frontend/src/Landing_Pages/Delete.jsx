import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "../features/auth/AuthSlice";
import api from "../api";

export default function Delete() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id, type, hasStore } = location.state || {};

  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState({ type: "", message: "", visible: false });
  const passwordInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!id || !type) {
      navigate("/");
    }
  }, [id, type, navigate]);

  useEffect(() => {
    if (step === 1 && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [step]);

  const showFlash = (type, message) => {
    setFlash({ type, message, visible: true });
    setTimeout(() => setFlash({ type, message, visible: false }), 5000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "store") {
        await api.post(`/stores/${id}/delete`, { password });
      } else if (type === "user") {
        await api.post(`/auth/${id}/delete`, { password });
      }

      setStep(2);
    } catch (err) {
      showFlash("error", err.response?.data?.message || "Incorrect password");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (type === "store") {
        await api.delete(`/stores/${id}`);
      } else if (type === "user") {
        await api.delete(`/auth/${id}`);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch(logout());
      }

      showFlash("success", `${type} deleted successfully`);

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      showFlash("error", "Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f8f9fa",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "400px",
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
        }}
      >
        <h4 className="mb-3 text-center">
          {type === "store" ? "Delete Store" : "Delete Account"}
        </h4>

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

        {step === 1 && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3 position-relative">
              <label className="form-label">Enter your password</label>
              <input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <button
              type="submit"
              className="btn btn-danger w-100"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Next"}
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <p>Are you sure you want to delete this {type}?</p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary flex-grow-1"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger flex-grow-1"
                onClick={() => {
                  if (type === "user" && hasStore) {
                    setStep(3);
                  } else {
                    handleDelete();
                  }
                }}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p>
              ⚠️ You also have stores created. Deleting your account will
              permanently delete all your stores as well. Are you sure you want
              to continue?
            </p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary flex-grow-1"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                Go Back
              </button>
              <button
                className="btn btn-danger flex-grow-1"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete Everything"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
