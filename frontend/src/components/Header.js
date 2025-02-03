import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import msplogo from "../msplogo.png";
import LoginModal from "../components/LoginModal";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    setIsModalOpen(false);
  };

  return (
    <header
      className={`${styles.header} ${isHomePage ? styles.homeHeader : ""}`}
    >
      <div className={styles.logoContainer}>
        <img src={msplogo} alt="Logo" className={styles.logo} />
        <Link to="/" className={styles.link}>
          <span className={styles.title}>MSP</span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/mypage" className={styles.navLink}>
          My Page
        </Link>
        <Link to="/aboutus" className={styles.navLink}>
          About Us
        </Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className={styles.navLink}>
            Log out
          </button>
        ) : (
          <button onClick={handleModalOpen} className={styles.navLink}>
            Login
          </button>
        )}
      </nav>
      {isModalOpen && (
        <LoginModal onClose={handleModalClose} onLogin={handleLogin} />
      )}
    </header>
  );
}

export default Header;
