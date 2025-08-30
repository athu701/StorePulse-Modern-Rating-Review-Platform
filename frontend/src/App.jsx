import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./features/auth/AuthSlice";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const authLoading = useSelector((state) => state.auth.loading);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch current user:", err);
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AppRoutes currentUser={currentUser} />
    </BrowserRouter>
  );
}
