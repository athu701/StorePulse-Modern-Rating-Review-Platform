import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/AuthSlice";
import LoginForm from "../../features/auth/LoginForm";
import SignupForm from "../../features/auth/SignupForm";

export default function Navbar({ onSearch, onAuthModalOpen }) {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogout = () => {
  dispatch(logout());
  if (onAuthModalOpen) {
    onAuthModalOpen("login"); 
  }
};

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
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
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form
              className="d-flex mx-auto my-2 my-lg-0"
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
                      ⭐ My Ratings
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle bg-transparent border-0"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fa-solid fa-user me-1"></i> Account
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to={`/profile/${user.id}`}>
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
                      <i className="fa-solid fa-store"></i> Create Store
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => onAuthModalOpen("login")}
                    >
                      <b>Login</b>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => onAuthModalOpen("signup")}
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
    </div>
  );
}

