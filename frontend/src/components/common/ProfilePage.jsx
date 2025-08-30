import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const userId = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/auth/users/${userId}`); // ✅ baseURL from api.js
        setUser(res.data.user);
        setFormData(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

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

  const handleSave = async (field) => {
    try {
      setLoading(true);
      const res = await api.put(`/auth/users/update`, {
        [field]: formData[field],
      });
      setUser(res.data.user);
      setSuccessMsg("✅ Profile updated successfully!");
      setError("");
      setEditingField(null);
    } catch (err) {
      console.error("Update failed:", err);
      setError("❌ Failed to update profile");
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    try {
      setLoading(true);
      const uploadData = new FormData();
      uploadData.append("image", imageFile);
      uploadData.append("userId", userId);

      const res = await api.put("/auth/users/update", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
      setFormData(res.data.user);
      setSuccessMsg("✅ Profile image updated successfully!");
      setEditingField(null);
      setImageFile(null);
    } catch (err) {
      console.error("Image update failed:", err);
      setError(
        err.response?.data?.error || "❌ Failed to update profile image"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("❌ New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccessMsg(res.data.message || "✅ Password changed successfully!");
      setError("");
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password change failed:", err);
      const backendMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "❌ Failed to change password";

      setError(backendMsg);
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-muted">Loading...</p>;
  if (!user) return <p className="text-center text-danger">No user found</p>;

  const handleUserDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/delete", {
      state: {
        id: user.id,
        type: "user",
        hasStore: user.hasStore,
      },
    });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="d-flex align-items-center mb-4">
          <div className="position-relative">
            <img
              src={formData.image_url || "https://via.placeholder.com/100"}
              alt="Profile"
              className="rounded-circle border border-3 border-primary"
              width="100"
              height="100"
              style={{ cursor: "pointer" }}
              onClick={() => setShowImagePopup(true)}
            />
          </div>

          <div className="ms-3">
            <h4 className="mb-0 fw-bold">{user.name}</h4>
            <small className="text-muted">@{user.username}</small>
            <p className="mb-0 text-secondary">{user.email}</p>
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
                  onClick={handleImageUpload}
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
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050,
            }}
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
                alt="Profile Large"
                className="img-fluid rounded"
              />
            </div>
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}
        {successMsg && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {successMsg}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setSuccessMsg("")}
            ></button>
          </div>
        )}

        <div className="row g-4">
          {["name", "username", "email", "address"].map((field) => (
            <div className="col-md-6" key={field}>
              <div className="d-flex flex-column border rounded p-3 bg-light">
                <label className="fw-semibold text-muted text-capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  className="form-control mt-1"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  disabled={!editingField}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 d-flex justify-content-end gap-2">
          {!editingField ? (
            <button
              className="btn btn-outline-primary"
              onClick={() => setEditingField(true)}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button
                className="btn btn-success"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await api.put("/auth/users/update", formData);

                    setUser(res.data.user);
                    setSuccessMsg("✅ Profile updated successfully!");
                    setEditingField(false);
                  } catch (err) {
                    console.error(err);
                    setError("❌ Failed to update profile");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                💾 Save All
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFormData(user);
                  setEditingField(false);
                }}
              >
                ❌ Cancel
              </button>
            </>
          )}
        </div>

        <div className="mt-4">
          <p className="text-muted mb-0">
            Joined:{" "}
            <span className="fw-semibold">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </p>
        </div>

        {user.hasStore && (
          <div className="mt-4">
            <button
              className="btn btn-warning w-100 fw-bold"
              onClick={() => (window.location.href = "/my-stores")}
            >
              🏪 Manage Your Store
            </button>
          </div>
        )}

        <div className="mt-4">
          {!showPasswordForm ? (
            <button
              className="btn btn-outline-danger w-100 fw-bold"
              onClick={() => setShowPasswordForm(true)}
            >
              🔒 Change Password
            </button>
          ) : (
            <div className="border rounded p-3 bg-light">
              <h6 className="fw-bold mb-3">Change Password</h6>

              <div className="mb-2 input-group">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  className="form-control"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPasswords.current ? "Hide" : "Show"}
                </button>
              </div>

              <div className="mb-2 input-group">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  className="form-control"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPasswords.new ? "Hide" : "Show"}
                </button>
              </div>

              <div className="mb-3 input-group">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPasswords.confirm ? "Hide" : "Show"}
                </button>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handlePasswordChange}
                >
                  Save Password
                </button>
              </div>
            </div>
          )}
          <div className="mt-4">
            <button
              className="btn btn-danger w-100 fw-bold"
              onClick={handleUserDeleteClick}
            >
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
