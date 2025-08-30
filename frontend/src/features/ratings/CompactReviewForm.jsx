import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRating } from "./RatingsSlice";

const StarInputCompact = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="d-flex align-items-center"
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
                fontSize: "1.5rem",
                color: filled ? "#f5c518" : "#ced4da",
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

const CompactReviewForm = ({ storeId }) => {
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
    <div
      className="card p-2 shadow-sm border-0 rounded-3"
      style={{ width: "100%", maxWidth: "350px", height: "70x" }}
    >
      <h6 className="mb-2">Your Review</h6>

      <div className="d-flex align-items-center mb-3 gap-2">
        <StarInputCompact
          value={newReviewRating}
          onChange={setNewReviewRating}
        />
        <input
          type="text"
          className="form-control flex-grow-1"
          value={newReviewText}
          onChange={(e) => setNewReviewText(e.target.value)}
          placeholder="Your comment…"
          maxLength={200}
        />
      </div>

      <div className="d-flex gap-2">
        <button
          className="btn btn-primary d-flex align-items-center gap-1"
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
          <i className="fa-solid fa-paper-plane"></i> Submit
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

export default CompactReviewForm;
