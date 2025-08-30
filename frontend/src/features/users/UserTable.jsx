import React, { useEffect, useState } from "react";
import axios from "axios";
import ActionModal from "./ActionModal";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function UsersTable({ role, searchTerm }) {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (el) => new bootstrap.Tooltip(el)
    );

    return () => {
      tooltipList.forEach((tooltip) => tooltip.dispose());
    };
  }, [users]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      let data = res.data;
      if (roleFilter !== "all") {
        data = data.filter((u) => u.role === roleFilter);
      }
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const openAction = (action, userId) => {
    setSelectedUserId(userId);
    setModalAction(action);
    setModalOpen(true);
  };

  const roleBadge = (userRole) => {
    const colors = {
      normal_user: "bg-gray-200 text-gray-700",
      store_owner: "bg-purple-200 text-purple-700",
      admin: "bg-blue-200 text-blue-700",
      system_admin: "bg-green-200 text-green-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[userRole]}`}
      >
        {userRole}
      </span>
    );
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.id.toString().includes(term) ||
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.name?.toLowerCase().includes(term)
    );
  });

  const handleRowClick = (user, event) => {
    if (event.target.closest("button")) return;
    navigate(`/admin/users/${user.id}`, { state: { userId: user.id } });
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <div className="mb-4">
        <select
          className="border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="normal_user">Normal Users</option>
          <option value="store_owner">Store Owners</option>
          <option value="admin">Admins</option>
          <option value="system_admin">System Admins</option>
        </select>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg w-full max-w-6xl">
        <table className="min-w-full border text-left bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={(e) => handleRowClick(u, e)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Click to see user profile"
                >
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.username}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{roleBadge(u.role)}</td>
                  <td className="px-4 py-3">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {role === "system_admin" && (
                      <>
                        {(u.role === "normal_user" ||
                          u.role === "store_owner") && (
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAction("makeAdmin", u.id);
                            }}
                          >
                            <i className="bi bi-shield-check me-1"></i> Make
                            Admin
                          </button>
                        )}

                        {u.role === "admin" && (
                          <button
                            className="btn btn-warning btn-sm me-2 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAction("removeAdmin", u.id);
                            }}
                          >
                            <i className="bi bi-shield-x me-1"></i> Remove Admin
                          </button>
                        )}
                      </>
                    )}

                    {(role === "system_admin" || role === "admin") &&
                      u.role !== "system_admin" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAction("delete", u.id);
                          }}
                        >
                          <i className="bi bi-trash me-1"></i> Delete
                        </button>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionName={modalAction}
        targetId={selectedUserId}
        onActionComplete={fetchUsers}
      />
    </div>
  );
}

export default UsersTable;
