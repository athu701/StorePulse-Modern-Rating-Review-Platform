import api from "../api";

export const addRatingAPI = (data) => api.post("/ratings", data);

export const updateRatingAPI = (id, data) => api.put(`/ratings/${id}`, data);

export const deleteRatingAPI = (id) => api.delete(`/ratings/${id}`);

export const fetchReviewsAPI = (storeId) =>
  api.get(`/ratings/stores/${storeId}`);

export const replyToReviewAPI = (parentId, data) =>
  api.post(`/ratings/${parentId}/reply`, data);
