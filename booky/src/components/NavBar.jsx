import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav
      className="navbar navbar-dark navbar-expand-lg  bg-light"
      id="main-navbar"
    >
      <Link className="navbar-brand text-white" to="/">
        BookyLeaks
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse text-white" id="navbarNav">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link text-white" to="/books">
            Books
          </NavLink>

          {!user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link text-white" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-item nav-link text-white" to="/register">
                Register
              </NavLink>
            </React.Fragment>
          )}
          {user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link text-info " to="/profile">
                {user.name}
              </NavLink>
              <NavLink className="nav-item nav-link text-white" to="/logout">
                Logout
              </NavLink>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
