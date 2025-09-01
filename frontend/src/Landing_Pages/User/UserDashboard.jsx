import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import StoreCard from "../../features/stores/StoreCard";
import RatingForm from "../../features/ratings/RatingForm";
import LoginForm from "../../features/auth/LoginForm";
import SignupForm from "../../features/auth/SignupForm";
import { useSelector, useDispatch } from "react-redux";
import { getStores } from "../../features/stores/StoresSlice";
import { Link } from "react-router-dom";
import CompactReviewFormFullCard from "../../features/ratings/CompactReviewForm";

const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 1040,
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "white",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
  zIndex: 1050,
  width: "90%",
  maxWidth: "400px",
};

export default function UserDashboard({
  showLikedOnly = false,
  showReviewedOnly = false,
  showMyStoresOnly = false,
}) {
  const dispatch = useDispatch();
  const { list: stores } = useSelector((state) => state.stores);
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getStores());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [modalOpen, setModalOpen] = useState(null);
  const [ratingSort, setRatingSort] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [deleteStoreId, setDeleteStoreId] = useState(null);
  const [flash, setFlash] = useState(null);

  const categories = [
    "restaurant",
    "clothing",
    "electronics",
    "grocery",
    "pharmacy",
    "others",
  ];
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 3);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setModalOpen("login");
      } else {
        setModalOpen(null);
      }
    }
  }, [user, loading]);

  const filteredStores = stores
    .filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (showLikedOnly && !store.isliked) return false;
      if (showReviewedOnly && !store.userreview) return false;
      if (
        showMyStoresOnly &&
        user &&
        !(
          (store.owner_id && Number(store.owner_id) === Number(user.id)) ||
          (store.owner?.id && Number(store.owner.id) === Number(user.id))
        )
      )
        return false;

      return true;
    })
    .filter((store) => {
      if (!categoryFilter) return true;
      return store.category === categoryFilter;
    });

  const sortedStores = [...filteredStores];
  if (ratingSort === "low")
    sortedStores.sort((a, b) => a.avg_rating - b.avg_rating);
  if (ratingSort === "high")
    sortedStores.sort((a, b) => b.avg_rating - a.avg_rating);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
<Navbar onSearch={setSearchTerm} onAuthModalOpen={setModalOpen} />

      <h1 style={{ marginLeft: "100px", marginTop: "20px" }}>
        Hello {user?.username}
      </h1>

      <div
        style={{
          marginLeft: "100px",
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          maxWidth: "calc(100% - 100px)",
        }}
      >
        {visibleCategories.map((cat) => (
          <button
            key={cat}
            className={`btn ${
              categoryFilter === cat ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCategoryFilter(categoryFilter === cat ? "" : cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}

        {categories.length > 3 && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            {showAllCategories ? "Less" : "More"}
          </button>
        )}
      </div>

      <div
        style={{
          marginLeft: "100px",
          marginTop: "10px",
          marginBottom: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        <div>
          <label className="me-2 fw-semibold">Sort by rating:</label>
          <select
            value={ratingSort}
            onChange={(e) => setRatingSort(e.target.value)}
            className="form-select d-inline-block w-auto"
          >
            <option value="">None</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>
      </div>

      <main
        style={{
          flexGrow: 1,
          filter: modalOpen ? "blur(5px)" : "none",
          pointerEvents: modalOpen ? "none" : "auto",
          userSelect: modalOpen ? "none" : "auto",
        }}
        className="dashboard-content"
      >
        <div className="container my-4">
          <div className="row">
            {sortedStores.map((store) => (
              <div
                key={store.id}
                className="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex justify-content-center"
              >
                <div>
                  <Link
                    to={`/store/${store.id}`}
                    className="text-decoration-none"
                  >
                    <StoreCard store={store} onReviewClick={setSelectedStore} />
                  </Link>

                  {user && (
                    <CompactReviewFormFullCard
                      storeId={store.id}
                      id="reform"
                      style={{
                        marginTop: "8px",
                        height: "120px",
                        maxHeight: "150px",
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedStore && (
          <RatingForm
            storeId={selectedStore.id}
            existingReview={selectedStore.userReview}
            onClose={() => setSelectedStore(null)}
          />
        )}
      </main>

      {flash && (
        <div
          className={`alert alert-${flash.type} alert-dismissible fade show`}
        >
          {flash.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setFlash(null)}
          />
        </div>
      )}

      {modalOpen === "login" && (
        <>
          <div style={backdropStyle} onClick={() => setModalOpen(null)} />
          <div style={modalStyle}>
            <button
              type="button"
              className="btn-close mb-3"
              aria-label="Close login modal"
              onClick={() => setModalOpen(null)}
            />
            <h5>Login</h5>
            <LoginForm
              onSuccess={() => setModalOpen(null)}
              onCancel={() => setModalOpen(null)}
            />

            <div className="mt-3 text-center">
              <small className="fs-6">Don’t have an account? </small>
              <button
                className="btn btn-primary"
                onClick={() => setModalOpen("signup")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </>
      )}

      {flash && (
        <div
          className={`alert alert-${flash.type} alert-dismissible fade show mx-3 mt-3`}
          role="alert"
        >
          {flash.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setFlash(null)}
          />
        </div>
      )}
      {modalOpen === "signup" && (
        <>
          <div style={backdropStyle} onClick={() => setModalOpen(null)} />
          <div style={modalStyle}>
            <button
              type="button"
              className="btn-close mb-3"
              aria-label="Close signup modal"
              onClick={() => setModalOpen(null)}
            />
            <h5>Sign Up</h5>
            <SignupForm
              onSuccess={(success, message) => {
                setFlash({ type: success ? "success" : "danger", message });
                setTimeout(() => setModalOpen(null), 5000);
              }}
              onCancel={() => setModalOpen(null)}
            />

            <div className="mt-3 text-center">
              <small className="fs-6">If you already have an account </small>
              <button
                className="btn btn-primary"
                onClick={() => setModalOpen("login")}
              >
                Login
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
