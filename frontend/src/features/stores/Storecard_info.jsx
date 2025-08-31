import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStorecard } from "../../services/storeService.js";
import Reviews from "../ratings/Review.jsx";

function Storecard_info() {
  const { id: storeId } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reviews");

  const currentUserId = "123";

  useEffect(() => {
    async function fetchStoreData() {
      try {
        const res = await fetchStorecard(storeId);
        const storeData = res.data.store;
        setStore(storeData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch store info:", error);
        setLoading(false);
      }
    }
    fetchStoreData();
  }, [storeId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading store info...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{
          transform: "scale(0.9)",
          transformOrigin: "top center",
          width: "100%",
        }}
      >
        <div className="row g-0">
          <div className="col-md-5 d-flex justify-content-center align-items-center position-relative">
            <img
              src={store.image_url}
              alt={store.name}
              className="img-fluid rounded-start h-100 object-fit-contain"
              style={{ minHeight: "250px" }}
            />

            {store.avg_rating > 0 && (
              <span
                className="badge bg-warning text-dark position-absolute shadow"
                style={{ top: "10px", right: "10px", fontSize: "1rem" }}
              >
                ⭐ {Number(store.avg_rating).toFixed(1)}
              </span>
            )}
          </div>

          <div className="col-md-7 d-flex align-items-center">
            <div className="card-body p-1 text-center w-100">
              <h2 className="card-title fw-bold mb-3 text-primary">
                {store.name}
              </h2>
              <p className="card-text fs-5">
                <b>
                  <i className="fa-solid fa-shop"></i> {store.category} shop
                </b>
              </p>
              <p className="card-text fs-5">{store.description}</p>
              <p className="card-text fs-5">
                <i className="fa-solid fa-location-dot me-1"></i>
                {store.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ul className="nav nav-tabs justify-content-center mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "location" ? "active" : ""}`}
              onClick={() => setActiveTab("location")}
            >
              Location
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "owner" ? "active" : ""}`}
              onClick={() => setActiveTab("owner")}
            >
              Store Owner Details
            </button>
          </li>
        </ul>

        <div className="tab-content text-center">
          {activeTab === "reviews" && (
            <>
              <h3 className="fw-bold mb-4">Customer Reviews</h3>
              <Reviews storeId={storeId} currentUserId={currentUserId} />
            </>
          )}

          {activeTab === "location" && (
            <div className="mapouter mx-auto" style={{ maxWidth: "800px" }}>
              <div className="gmap_canvas">
                <iframe
                  className="gmap_iframe"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    store.address
                  )}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                  title="store-location"
                ></iframe>
              </div>
            </div>
          )}

          {activeTab === "owner" && (
            <div
              className="card shadow-sm border-0 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="card-body">
                <h4 className="fw-bold text-primary mb-3">
                  <i className="fa-solid fa-user-tie me-2"></i> Store Owner
                </h4>
                <p className="fs-5">
                  <b>Name:</b> {store.store_owner_name}
                </p>
                <p className="fs-5">
                  <b>Email:</b> {store.email}
                </p>
                <p className="fs-5">
                  <b>Phone:</b> {store.phone_no}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Storecard_info;
