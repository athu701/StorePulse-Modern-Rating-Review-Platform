import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviews,
  updateRating,
  deleteRating,
  replyToReview,
} from "./RatingsSlice";
import ReviewForm from "./ReviewForm";

const StarRating = ({ rating }) => (
  <span>
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        style={{
          color: i <= rating ? "#ba9f3eff" : "#ddd",
          fontSize: "1.2rem",
          marginRight: "2px",
        }}
      >
        ★
      </span>
    ))}
  </span>
);

const ReplyItem = ({ reply, currentUserId, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.review);

  return (
    <div className="d-flex align-items-start mb-2">
      <img
        src={reply.image_url || "/default-user.png"}
        alt="user"
        className="rounded-circle me-2"
        style={{ width: "30px", height: "30px", objectFit: "cover" }}
      />
      <div className="flex-grow-1">
        <div className="bg-light rounded p-2">
          <strong>
            {reply.username}{" "}
            {reply.userId === reply.storeOwnerId && (
              <span className="badge bg-success ms-1">@byStoreOwner</span>
            )}
          </strong>
          {reply.storeOwner && (
            <span className="badge bg-success ms-2">Owner</span>
          )}

          {!isEditing ? (
            <p className="mb-1">{reply.review}</p>
          ) : (
            <>
              <textarea
                className="form-control"
                rows={2}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-2 d-flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => {
                    onEdit(reply.id, editContent);
                    setIsEditing(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          <div className="text-muted small">
            {new Date(reply.created_at).toLocaleDateString("en-IN")}{" "}
            {new Date(reply.created_at).toLocaleTimeString("en-IN")}
          </div>
        </div>

        {reply.userId === currentUserId && (
          <div className="mt-1">
            <button
              className="btn btn-sm btn-outline-warning me-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(reply.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewItem = ({ review, currentUserId, onReply, onEdit, onDelete }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.review);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const replies = review.replies || [];
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 2);

  return (
    <div className="ms-3 mt-3">
      <div className="card shadow-sm border-0 rounded-3 p-3">
        <div className="d-flex align-items-center mb-2">
          <img
            src={review.image_url || "/default-user.png"}
            alt="user"
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <div>
            <strong>
              {review.username}{" "}
              {review.userId === review.storeOwnerId && (
                <span className="badge bg-success ms-1">@byStoreOwner</span>
              )}
            </strong>

            {review.storeOwner && (
              <span className="badge bg-success ms-2">Owner</span>
            )}
            <div className="text-muted small">
              {new Date(review.created_at).toLocaleDateString("en-IN")}{" "}
              {new Date(review.created_at).toLocaleTimeString("en-IN")}
            </div>
          </div>
          <div className="ms-auto">
            <StarRating rating={review.rating} />
          </div>
        </div>

        {!isEditing ? (
          <p className="mb-2">{review.review}</p>
        ) : (
          <>
            <textarea
              className="form-control"
              rows={2}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="mt-2 d-flex gap-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  onEdit(review.id, editContent);
                  setIsEditing(false);
                }}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        <div className="mt-2 d-flex gap-3">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowReplyForm((s) => !s)}
          >
            Reply
          </button>
          {review.userId === currentUserId && (
            <>
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(review.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>

        {showReplyForm && (
          <div className="mt-3">
            <textarea
              className="form-control"
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
            />
            <div className="mt-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  if (!replyContent.trim()) return;
                  onReply(review.id, replyContent, review.storeId);
                  setReplyContent("");
                  setShowReplyForm(false);
                }}
              >
                Submit Reply
              </button>
            </div>
          </div>
        )}
      </div>

      {replies.length > 0 && (
        <div className="mt-3 ms-5">
          {visibleReplies.map((rep) => (
            <ReplyItem
              key={rep.id}
              reply={rep}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {replies.length > 2 && (
            <button
              className="btn btn-sm btn-link text-primary"
              onClick={() => setShowAllReplies((s) => !s)}
            >
              {showAllReplies
                ? "Hide replies"
                : `View ${replies.length - 2} more repl${
                    replies.length - 2 > 1 ? "ies" : "y"
                  }`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Reviews = ({ storeId }) => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.ratings);

  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id;

  const [flash, setFlash] = useState(null);
  const { error } = useSelector((state) => state.ratings);

  useEffect(() => {
    if (storeId) {
      dispatch(fetchReviews(storeId));
    }
  }, [dispatch, storeId]);

  useEffect(() => {
    if (error) {
      setFlash(error);
      const t = setTimeout(() => setFlash(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleReply = (reviewId, content, storeId) => {
    dispatch(replyToReview({ reviewId, text: content, storeId }));
  };

  const handleEdit = (reviewId, newContent) => {
    dispatch(updateRating({ id: reviewId, data: { review: newContent } }));
  };

  const handleDelete = (reviewId) => {
    dispatch(deleteRating(reviewId));
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="reviews mt-4">
      {flash && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {flash}
          <button
            type="button"
            className="btn-close"
            onClick={() => setFlash(null)}
          ></button>
        </div>
      )}

      <h5 className="mb-3">Customer Reviews</h5>
      {reviews.length === 0 ? (
        user ? (
          <p>No reviews yet. Be the first to write one!</p>
        ) : (
          <p className="text-muted">
            Please log in and be the first to write a review.
          </p>
        )
      ) : (
        reviews.map((rev) => (
          <ReviewItem
            key={rev.id}
            review={rev}
            currentUserId={currentUserId}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}

      <div className="mt-4">
        {user && (
          <>
            {reviews.some((r) => r.userId === user.id && !r.parentReviewId) ? (
              <p className="text-warning">
                You already wrote a review. You can edit it above.
              </p>
            ) : (
              <ReviewForm storeId={storeId} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;
