import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRating } from "./RatingsSlice";

const StarInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="d-inline-flex align-items-center"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            className="btn btn-link p-0 me-1 text-decoration-none"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onChange(n)}
            style={{ lineHeight: 1 }}
          >
            <span
              style={{
                fontSize: "1.9rem",
                color: filled ? "#f5c518" : "#ced4da",
                transition: "color 120ms ease",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
};

const ReviewForm = ({ storeId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);
  const canSubmit =
    newReviewText.trim() && newReviewRating > 0 && user?.id && storeId;

  const handleSubmit = () => {
    if (!canSubmit) return;
    dispatch(
      addRating({
        data: {
          store_id: storeId,
          user_id: user.id,
          rating: newReviewRating,
          review: newReviewText.trim(),
        },
      })
    );
    setNewReviewText("");
    setNewReviewRating(0);
  };

  return (
    <div className="card p-3 shadow-sm border-0 rounded-3 mt-4">
      <h5 className="mb-3">Submit Your Review</h5>

      <div className="mb-3">
        <label className="form-label d-block mb-1">Rating</label>
        <StarInput value={newReviewRating} onChange={setNewReviewRating} />
      </div>

      <input
        type="text"
        className="form-control mb-3"
        value={newReviewText}
        onChange={(e) => setNewReviewText(e.target.value)}
        placeholder="Share details of your experience…"
        maxLength={500}
      />

      <div className="d-flex gap-2">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          title={
            !user?.id
              ? "Login required"
              : !newReviewRating
              ? "Select a rating"
              : ""
          }
        >
          Submit Review
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => {
            setNewReviewText("");
            setNewReviewRating(0);
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
