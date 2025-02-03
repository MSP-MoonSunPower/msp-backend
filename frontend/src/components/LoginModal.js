import React from "react";
import styles from "./LoginModal.module.css";

function LoginModal({ onClose, onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="아이디를 입력하세요."
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="비밀번호를 입력하세요."
            className={styles.input}
            required
          />
          <button type="submit" className={styles.loginButton}>
            로그인하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
