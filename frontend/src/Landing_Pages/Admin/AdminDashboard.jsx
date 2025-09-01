import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserTable from "../../features/users/UserTable";
import StoresTable from "../../features/stores/StoresTable";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import DefaultDashboard from "../User/UserDashboard";
import UserDashboard from "../User/UserDashboard";
import { Navigate } from "react-router-dom";


function Dashboard({ role }) {
  const [view, setView] = useState("users");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [roleChoice, setRoleChoice] = useState("admin");

  const currentUser =
    useSelector((state) => state.auth.user) ||
    JSON.parse(localStorage.getItem("user"));

  if (roleChoice === "user") {
    return <UserDashboard role={role} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 text-center border-b shadow-sm">
  <button
    onClick={() => setRoleChoice("user")}
    className={`px-6 py-2 rounded-xl font-semibold shadow-md transform transition-all duration-200
      ${
        roleChoice === "user"
          ? "bg-blue-600 text-white hover:bg-blue-700 scale-105"
          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
      }`}
  >
    🏠 Go to User Dashboard
  </button>
</div>

      <Navbar onSearch={setSearchTerm} onAuthModalOpen={setModalOpen} />

      <div className="flex flex-1">
        <div className="w-48 bg-gray-800 text-white p-4">
          <h1 className="text-lg font-bold mb-6">Dashboard</h1>
          <button
            onClick={() => {
              setView("users");
              setSelectedUser(null);
            }}
            className={`w-full text-left px-2 py-2 rounded mb-2 ${
              view === "users" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
          >
            👤 View Users
          </button>
          <button
            onClick={() => {
              setView("stores");
              setSelectedUser(null);
            }}
            className={`w-full text-left px-2 py-2 rounded ${
              view === "stores" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
          >
            🏬 View Stores
          </button>
        </div>

        <div className="flex-1 flex flex-col bg-gray-50 p-6 overflow-auto">
          <div className="flex-1">
            {view === "users" && !selectedUser && (
              <UserTable
                onUserClick={setSelectedUser}
                role={currentUser?.role}
                searchTerm={searchTerm}
              />
            )}

            {view === "users" && selectedUser && (
              <div>
                <button
                  className="mb-4 px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setSelectedUser(null)}
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedUser.name}'s Profile
                </h2>
                <p>
                  <strong>Username:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>
            )}

            {view === "stores" && <StoresTable />}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
