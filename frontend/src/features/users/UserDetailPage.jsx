import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ActionModal from "./ActionModal";
import api from "../../api";

export default function UserDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [likedStores, setLikedStores] = useState([]);
  const [reviewedStores, setReviewedStores] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);

  const userId = location.state?.userId || id;

  useEffect(() => {
    if (userId) fetchUserData(userId);
  }, [userId]);

  const fetchUserData = async (uid) => {
    try {
      const res = await api.get(`/users/${uid}`);
      setUser(res.data.user);
      setLikedStores(res.data.likedStores);
      setReviewedStores(res.data.reviewedStores);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const openAction = (action, uid) => {
    setActionUserId(uid);
    setModalAction(action);
    setModalOpen(true);
  };

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title">
            {user.name} <small className="text-muted">({user.username})</small>
          </h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            <span className="badge bg-info">{user.role}</span>
          </p>
        </div>
      </div>

      {user.role !== "system_admin" && (
        <div className="mb-4">
          {user.role === "admin" ? (
            <button
              className="btn btn-warning text-white me-2"
              onClick={() => openAction("removeAdmin", user.id)}
            >
              Remove Admin
            </button>
          ) : (
            <button
              className="btn btn-primary me-2"
              onClick={() => openAction("makeAdmin", user.id)}
            >
              Make Admin
            </button>
          )}

          <button
            className="btn btn-danger"
            onClick={() => openAction("delete", user.id)}
          >
            Delete User
          </button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Liked Stores</h5>
        </div>
        <div className="card-body">
          {likedStores.length ? (
            <ul className="list-group">
              {likedStores.map((store) => (
                <li
                  key={store.id}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/store/${store.id}`)}
                >
                  {store.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No liked stores.</p>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Reviewed Stores</h5>
        </div>
        <div className="card-body">
          {reviewedStores.length ? (
            <ul className="list-group">
              {reviewedStores.map((store) => (
                <li
                  key={store.id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/store/${store.id}`)}
                >
                  <div>
                    <strong>{store.name}</strong>
                    <br />
                    <span className="text-muted">
                      Review: {store.userRating.review}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviewed stores.</p>
          )}
        </div>
      </div>

      <ActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionName={modalAction}
        targetId={actionUserId}
        onActionComplete={() => fetchUserData(userId)}
      />
    </div>
  );
}
