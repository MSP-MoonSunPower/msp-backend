import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../logo.jpg";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>환영합니다</h1>
      <Link to="/select">
        <button className={styles.startButton}>시작하기</button>
      </Link>
    </div>
  );
}
export default Home;
