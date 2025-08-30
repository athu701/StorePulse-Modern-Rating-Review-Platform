import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/AuthSlice";
import LoginForm from "../../features/auth/LoginForm";
import SignupForm from "../../features/auth/SignupForm";

export default function Navbar({ onSearch }) {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
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
  const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1040,
  };

  return (
    <div className="container">
      <nav
        className="navbar navbar-expand-lg border-bottom shadow-sm"
        style={{ backgroundColor: "#FFF" }}
      >
        <div className="container p-2">
          <Link className="navbar-brand" to="/">
            <img
              src="media\\images\\rating.png"
              alt="media"
              style={{ width: "60px", height: "auto" }}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form
              className="d-flex mx-auto my-2 my-lg-0"
              role="search"
              onSubmit={handleSearchSubmit}
              style={{ maxWidth: "400px", flex: "1" }}
            >
              <input
                className="form-control rounded-start"
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary rounded-end" type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
              {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/liked-stores">
                      ❤️ Like
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/my-ratings">
                      ⭐ View Your Ratings
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle bg-transparent border-0"
                      id="accountDropdown"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fa-solid fa-user me-1"></i> Account
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link
                          className="dropdown-item"
                          to={`/profile/${user.id}`}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/create-store">
                      <i class="fa-solid fa-store"></i> Create Store
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => setShowLogin(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <b>Login</b>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => setShowSignup(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <b>Signup</b>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {showLogin && (
        <>
          <div style={backdropStyle} onClick={() => setShowLogin(false)} />
          <div style={modalStyle}>
            <button
              type="button"
              className="btn-close mb-3"
              aria-label="Close"
              onClick={() => setShowLogin(false)}
            />
            <h5>Sign In</h5>
            <LoginForm
              onSuccess={() => setShowLogin(false)}
              onCancel={() => setShowLogin(false)}
            />
          </div>
        </>
      )}

      {showSignup && (
        <>
          <div style={backdropStyle} onClick={() => setShowSignup(false)} />
          <div style={modalStyle}>
            <button
              type="button"
              className="btn-close mb-3"
              aria-label="Close"
              onClick={() => setShowSignup(false)}
            />
            <h5>Sign Up</h5>
            <SignupForm
              onSuccess={() => setShowSignup(false)}
              onCancel={() => setShowSignup(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
