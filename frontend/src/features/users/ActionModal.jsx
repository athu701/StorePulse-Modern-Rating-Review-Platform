import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function ActionModal({
  isOpen,
  onClose,
  actionName,
  targetId,
  onActionComplete,
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setShowPassword(false);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      let url = "";
      let method = "POST";

      if (actionName === "makeAdmin") {
        url = `/users/${targetId}/make-admin`;
        method = "PUT";
      } else if (actionName === "removeAdmin") {
        url = `/users/${targetId}/remove-admin`;
        method = "PUT";
      } else if (actionName === "delete") {
        url = `/users/${targetId}`;
        method = "DELETE";
      } else if (actionName === "deleteStore") {
        url = `/users/stores/${targetId}`;
        method = "DELETE";
      }

      const res = await api(url, {
        method,
        data: { password },
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          data = { error: res.statusText || "Unknown error" };
        }
        throw new Error(data.error || "Something went wrong");
      }

      onActionComplete();
      onClose();
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const actionLabels = {
    makeAdmin: "Make Admin",
    removeAdmin: "Remove Admin",
    delete: "Delete User",
    deleteStore: "Delete Store",
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm {actionLabels[actionName]}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Please confirm <strong>{actionLabels[actionName]}</strong> for ID{" "}
              <strong>{targetId}</strong>.
            </p>
            <div className="mb-3">
              <label className="form-label">
                Enter your password to confirm
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary mt-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
            </div>
            {error && <p className="text-danger">{error}</p>}
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className={`btn ${
                actionName === "delete" || actionName === "deleteStore"
                  ? "btn-danger"
                  : actionName === "removeAdmin"
                  ? "btn-warning"
                  : "btn-primary"
              }`}
              onClick={handleConfirm}
              disabled={loading || !password}
            >
              {loading ? "Processing..." : actionLabels[actionName]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionModal;
