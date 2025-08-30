import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionModal from "../users/ActionModal";
import api from "../../api";

function StoresTable() {
  const [stores, setStores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();

  const categories = [
    "all",
    "restaurant",
    "clothing",
    "electronics",
    "grocery",
    "pharmacy",
    "others",
  ];

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await api.get("/users/stores");
      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores", err);
    }
  };

  const openAction = (action, storeId) => {
    setSelectedStoreId(storeId);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleRowClick = (store, event) => {
    if (event.target.closest("button")) return;
    navigate(`/store/${store.id}`);
  };

  const filteredStores =
    selectedCategory === "all"
      ? stores
      : stores.filter((s) => s.category === selectedCategory);

  return (
    <div className="p-4">
      <h2 className="h4 fw-bold mb-3">Stores</h2>

      <div className="d-flex gap-2 flex-wrap mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${
              selectedCategory === cat ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-responsive shadow rounded">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Owner</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.length > 0
              ? filteredStores.map((s) => {
                  return (
                    <tr
                      key={s.id}
                      onClick={(e) => handleRowClick(s, e)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{s.id}</td>
                      <td>{s.name}</td>
                      <td>{s.owner_id}</td>
                      <td>{s.category || "—"}</td>
                      <td>{new Date(s.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/store/${s.id}`);
                            }}
                          >
                            <i className="bi bi-eye me-1"></i> View Store
                          </button>

                          <button
                            className="btn btn-sm btn-info text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/users/${s.owner_id}`, {
                                state: { userId: s.owner_id },
                              });
                            }}
                          >
                            <i className="bi bi-person me-1"></i> View Owner
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAction("deleteStore", s.id);
                            }}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-3">
                    No stores found
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
        targetId={selectedStoreId}
        onActionComplete={fetchStores}
      />
    </div>
  );
}

export default StoresTable;
