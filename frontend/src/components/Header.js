import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../logo.jpg"; // 로고 이미지 경로에 맞게 조정 필요

function Header({ isHomePage }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  return (
    <header
      className={`${styles.header} ${isHomePage ? styles.homeHeader : ""}`}
    >
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.title}>MSP</span>
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
        <Link to="/mypage" className={styles.navLink}>
          My Page
        </Link>
        {isLoggedIn ? (
          <Link to="/" onClick={handleLogout} className={styles.navLink}>
            Log out
          </Link>
        ) : (
          <Link to="/login" onClick={handleLogin} className={styles.navLink}>
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
