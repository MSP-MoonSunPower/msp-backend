import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../logo.jpg";

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
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <Link to="/" className={styles.link}>
          <span className={styles.title}>MSP</span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
        <Link to="/About Us" className={styles.navLink}>
          About Us
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
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
