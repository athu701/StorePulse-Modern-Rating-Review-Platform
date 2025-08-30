import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addRatingAPI,
  updateRatingAPI,
  deleteRatingAPI,
  fetchReviewsAPI,
} from "../../services/ratingServices";
import api from "../../api";

const updateNode = (list, updated) =>
  list.map((r) =>
    r.id === updated.id
      ? { ...r, ...updated }
      : { ...r, replies: r.replies ? updateNode(r.replies, updated) : [] }
  );

const removeNode = (list, id) =>
  list
    .filter((r) => r.id !== id)
    .map((r) => ({
      ...r,
      replies: r.replies ? removeNode(r.replies, id) : [],
    }));

const insertReply = (list, reply) =>
  list.map((r) => {
    if (r.id === reply.parentReviewId) {
      return { ...r, replies: [...(r.replies || []), reply] };
    }
    return { ...r, replies: r.replies ? insertReply(r.replies, reply) : [] };
  });

const recomputeAverage = (list) => {
  const roots = list.filter(
    (r) => !r.parentReviewId && typeof r.rating === "number"
  );
  if (!roots.length) return 0;
  const sum = roots.reduce((acc, r) => acc + (r.rating || 0), 0);
  return sum / roots.length;
};

const normalizeReview = (r) => ({
  ...r,
  parentReviewId: r.parent_review_id,
  userId: r.user_id,
  storeId: r.store_id,
  replies: r.replies ? r.replies.map(normalizeReview) : [],
});

export const fetchReviews = createAsyncThunk(
  "ratings/fetchReviews",
  async (storeId) => {
    const res = await fetchReviewsAPI(storeId);
    return {
      reviews: (res.data.reviews || []).map(normalizeReview),
      averageRating: res.data.averageRating,
    };
  }
);

export const addRating = createAsyncThunk(
  "ratings/addRating",
  async ({ data }) => {
    const res = await addRatingAPI(data);
    return normalizeReview(res.data);
  }
);

export const updateRating = createAsyncThunk(
  "ratings/updateRating",
  async ({ id, data }) => {
    const res = await updateRatingAPI(id, data);
    return normalizeReview(res.data);
  }
);

export const deleteRating = createAsyncThunk(
  "ratings/deleteRating",
  async (id) => {
    await deleteRatingAPI(id);
    return id;
  }
);

export const replyToReview = createAsyncThunk(
  "ratings/reply",
  async ({ reviewId, text, storeId }, { getState }) => {
    const userId = getState().auth.user.id;

    const res = await api.post(
      `api/ratings/${reviewId}/reply`,
      {
        userId,
        storeId,
        review: text,
        parentReviewId: reviewId,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    return normalizeReview(res.data);
  }
);

const ratingsSlice = createSlice({
  name: "ratings",
  initialState: {
    reviews: [],
    averageRating: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload.reviews;
        state.averageRating =
          typeof action.payload.averageRating === "number"
            ? action.payload.averageRating
            : recomputeAverage(state.reviews);
      })

      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch ratings";
      })

      .addCase(addRating.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
        state.averageRating = recomputeAverage(state.reviews);
      })

      .addCase(updateRating.fulfilled, (state, action) => {
        state.reviews = updateNode(state.reviews, action.payload);
        state.averageRating = recomputeAverage(state.reviews);
      })

      .addCase(deleteRating.fulfilled, (state, action) => {
        state.reviews = removeNode(state.reviews, action.payload);
        state.averageRating = recomputeAverage(state.reviews);
      })

      .addCase(replyToReview.fulfilled, (state, action) => {
        const reply = action.payload;
        const parent = state.reviews.find((r) => r.id === reply.parentReviewId);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(reply);
        }
      });
  },
});

export default ratingsSlice.reducer;
