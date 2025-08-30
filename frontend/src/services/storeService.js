import api from "../api";

export const fetchStores = () => api.get("/stores");

export const fetchStorecard = (id) => api.get(`/stores/${id}`);

export const fetchStoresWithReactions = (userId) =>
  api.get(`/stores/user/${userId}`);

export const toggleLikeStore = async (storeId) => {
  try {
    const res = await api.post(`/reactions/${storeId}`);

    const storeUpdate = {
      id: storeId,
      isLiked: res.data.reaction === "like",
    };

    return { data: storeUpdate };
  } catch (err) {
    console.error("Toggle reaction failed:", err);
    throw err;
  }
};
