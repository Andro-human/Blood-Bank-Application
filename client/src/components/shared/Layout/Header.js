import React from "react";
import "../../../styles/navbar.css";
import { BiDonateBlood } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  //logout handler
  const handlelogout = () => {
    localStorage.clear();
    toast.success("Logout Successfully");
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-brand">
            <BiDonateBlood color="red" /> Blood Bank App
          </div>
          <ul className="navbar-nav flex-row">
            <li className="nav-item ">
              <p className="nav-link">
                <FaUserCircle /> Welcome{" "}
                {user?.name || user?.hospitalName || user?.organisationName}
                <span className="badge ms-2">{user?.role}</span>
              </p>
            </li>
            <li className="nav-item mx-3">
              <button className="btn btn-danger" onClick={handlelogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
