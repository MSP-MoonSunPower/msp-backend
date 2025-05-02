import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import msplogo from "../assets/msplogo.png";
import LoginModal from "./LoginModal";

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

  const handleLogoClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <header
      className={`${styles.header} ${isHomePage ? styles.homeHeader : ""}`}
    >
      <div className={styles.logoContainer} onClick={handleLogoClick}>
        <span className={styles.title}>★ 문 썬 빠 워 ★</span>
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
