import api from "../api";

export const loginUser = (data) => api.post("/auth/login", data);

export const signupUser = (data) => {
  return api.post("/auth/signup", data, {
    headers:
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
  });
};

export const changePassword = (data) =>
  api.patch("/auth/change-password", data);

export const getUserById = (id) => api.get(`/auth/users/${id}`);

export const updateUserinProfile = (data) =>
  api.put("/auth/users/update", data);

export const fetchUserProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};
