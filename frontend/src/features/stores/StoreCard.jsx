import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLike } from "../../features/stores/StoresSlice";
import { useNavigate } from "react-router-dom";
import "../../index.css";

export default function StoreCard({ store, onReviewClick }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(store.isliked);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullAddr, setShowFullAddr] = useState(false);

  const maxDesc = 60;
  const maxAddr = 40;

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    setIsLiked((prev) => !prev);
    dispatch(toggleLike(store.id));
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-store/${store.id}`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/delete", { state: { id: store.id, type: "store" } });
  };

  const handleCardClick = () => {
    navigate(`/store/${store.id}`);
  };

  return (
    <div className="card-wrapper w-100 shadow-sm" onClick={handleCardClick}>
      <div className="card-custom">
        <div className="card-img-container">
          <img src={store.image_url} alt={store.name} />
          <div className="hover-overlay">
            <span>Click to view more & comments</span>
          </div>
          <div
            className="avg-rating position-absolute d-flex align-items-center"
            style={{
              bottom: "8px",
              right: "8px",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}
          >
            {store.avg_rating}{" "}
            <span style={{ marginLeft: "4px", color: "#FFD700" }}>★</span>
          </div>
        </div>

        <div className="card-body-fixed">
          <h5
            className="card-title fs-4 mb-2 text-center"
            style={{ color: "black" }}
          >
            {store.name}
          </h5>

          <p
            onClick={(e) => {
              e.stopPropagation();
              setShowFullAddr(!showFullAddr);
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "black",
            }}
            className="mb-3"
          >
            <i
              className="fa-solid fa-location-dot"
              style={{ marginRight: "6px" }}
            ></i>
            {showFullAddr || store.address.length <= maxAddr
              ? store.address
              : store.address.slice(0, maxAddr) + "... "}
            {store.address.length > maxAddr && (
              <span className="view-more-link">
                {showFullAddr ? "View Less" : "View More"}
              </span>
            )}
          </p>

          <p>
            <i className="fa-solid fa-shop"></i> {store.category} shop
          </p>

          <p
            onClick={(e) => {
              e.stopPropagation();
              setShowFullDesc(!showFullDesc);
            }}
            className="text-muted"
            style={{ cursor: "pointer" }}
          >
            {showFullDesc || store.description.length <= maxDesc
              ? store.description
              : store.description.slice(0, maxDesc) + "... "}
            {store.description.length > maxDesc && (
              <span className="view-more-link">
                {showFullDesc ? "View Less" : "View More"}
              </span>
            )}
          </p>
          <div className="d-flex justify-content-between mt-auto gap-2">
            {user && typeof store.isliked !== "undefined" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleLike(e);
                }}
                className={`btn btn-sm ${
                  isLiked ? "btn-danger" : "btn-outline-danger"
                } like-button-top-right`}
              >
                {isLiked ? "❤️" : "♡"}
              </button>
            )}

            {user && user.id === store.owner_id && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditClick(e);
                  }}
                  className="btn btn-sm btn-outline-primary"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteClick(e);
                  }}
                  className="btn btn-sm btn-outline-danger"
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
