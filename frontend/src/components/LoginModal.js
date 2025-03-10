import React, { useState } from "react";
import styles from "./LoginModal.module.css";
import { Link, useNavigate } from "react-router-dom";

function LoginModal({ onClose, onLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://moonsunpower.com/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        onLogin(data.token); // 로그인 성공 시 토큰 저장
        navigate("/");
        alert("반갑습니다! 오늘도 즐거운 MSP하세요:)");
      } else {
        alert("로그인 실패");
      }
    } catch (err) {
      setError("서버 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="아이디를 입력하세요."
            className={styles.input}
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요."
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.loginButton}>
            로그인하기
          </button>
        </form>
        <div className={styles.signup}>
          <Link to="/signup" onClick={onClose}>
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
