import React from "react";
import styles from "./MyPage.module.css";
import mypage from "../mypage.jpg";
function MyPage() {
  return (
    <div className={styles.imageContainer}>
      <img src={mypage} alt="MyPage" />
    </div>
  );
}

export default MyPage;
