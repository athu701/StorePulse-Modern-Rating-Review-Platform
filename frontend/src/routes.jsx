import React from "react";
import { Routes, Route } from "react-router-dom";
import UserDashboard from "./Landing_Pages/User/UserDashboard";
import AdminDashboard from "./Landing_Pages/Admin/AdminDashboard";
import Login from "./Landing_Pages/Login";
import Signup from "./Landing_Pages/Signup";
import NotFound from "./Landing_Pages/NotFound";
import Storecard_info from "./features/stores/Storecard_info";
import ProfilePage from "./components/common/ProfilePage";
import Createstore from "./Landing_Pages/Createstore";
import EditStore from "./components/common/EditStore";
import Delete from "./Landing_Pages/Delete";
import UserDetailPage from "./features/users/UserDetailPage";

export default function AppRoutes({ currentUser }) {
  const role = currentUser?.role;
  console.log("role", role);
  let DefaultDashboard;
  if (role === "system_admin" || role === "admin") {
    DefaultDashboard = <AdminDashboard role={role} />;
  } else if (role === "store_owner" || role === "normal_user") {
    DefaultDashboard = <UserDashboard />;
  } else {
    DefaultDashboard = <UserDashboard />;
  }

  return (
    <Routes>
      <Route path="/" element={DefaultDashboard} />
      <Route path="/store/:id" element={<Storecard_info />} />
      <Route path="/admin" element={<AdminDashboard role={role} />} />
      <Route path="/admin/users/:userId" element={<UserDetailPage role={role} />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/stores" element={<UserDashboard showLikedOnly={false} />} />
      <Route path="/liked-stores" element={<UserDashboard showLikedOnly />} />
      <Route path="/my-ratings" element={<UserDashboard showReviewedOnly />} />
      <Route path="/my-stores" element={<UserDashboard showMyStoresOnly />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/create-store" element={<Createstore />} />
      <Route path="/edit-store/:id" element={<EditStore />} />
      <Route path="/delete" element={<Delete />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
