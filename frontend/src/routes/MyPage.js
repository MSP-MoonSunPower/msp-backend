import React from "react";
import styles from "./MyPage.module.css";
import myPage from "../myPage.jpg";

function MyPage() {
  return (
    <div className={styles.imageContainer}>
      <img src={myPage} alt="Logo" className={styles.image} />
    </div>
  );
}

export default MyPage;
