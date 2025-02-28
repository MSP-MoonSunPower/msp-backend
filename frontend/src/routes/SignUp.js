import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    nickname: "",
    birth_date: "",
    rank: "normal",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("https://moonsunpower.com/user/signup/", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess("회원가입이 완료되었습니다!");
      } else {
        setError(data.detail || "회원가입 실패");
      }
    } catch (err) {
      setError("서버 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2 className={styles.SignUp}>회원가입</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">아이디 *</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="아이디를 입력하세요."
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name">이름 *</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="이름을 입력하세요."
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호 *</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요."
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">비밀번호 확인 *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요."
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">이메일 *</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력하세요."
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nickname">닉네임 *</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            placeholder="닉네임을 입력하세요."
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="birth_date">생년월일 (선택)</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignUp;
