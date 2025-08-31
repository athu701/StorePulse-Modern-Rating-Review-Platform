import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRating, updateRating, deleteRating } from "./RatingsSlice";

export default function RatingForm({ storeId, existingReview, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(existingReview?.rating_value || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");

  if (!user) {
    return <p className="text-danger">You must be logged in to review.</p>;
  }
const handleSubmit = async () => {
  if (!canSubmit) return;

  try {
    await dispatch(
      addRating({
        data: {
          store_id: storeId,
          user_id: user.id,
          rating: newReviewRating,
          review: newReviewText.trim(),
        },
      })
    ).unwrap();

    // ✅ Refetch reviews immediately after successful submit
    dispatch(fetchReviews(storeId));

    setNewReviewText("");
    setNewReviewRating(0);
  } catch (err) {
    console.error("Failed to submit review:", err);
  }
};

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {existingReview ? "Edit Review" : "Add Review"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Rating (1-5)</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Comment</label>
              <textarea
                className="form-control"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            {existingReview && (
              <button
                onClick={() => {
                  dispatch(deleteRating(existingReview.id));
                  onClose();
                }}
                className="btn btn-danger me-auto"
              >
                Delete
              </button>
            )}

            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleSubmit}>
              {existingReview ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
