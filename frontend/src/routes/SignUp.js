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
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 아이디: 영어 + 숫자만 입력 가능하도록 수정
    if (name === "username" && !/^[a-zA-Z0-9]*$/.test(value)) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    //  아이디: 영어+숫자 조합, 4~20자
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(formData.username)) {
      alert("아이디는 영어 및 숫자로 이루어진 4~20자여야 합니다.");
      return;
    }

    //  비밀번호 필수 입력 확인
    if (!formData.password.trim()) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    //  비밀번호: 특수문자 + 숫자 + 영어 포함 & 최소 8자 이상
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert(
        "비밀번호는 영어, 숫자, 특수문자를 포함하고 8자리 이상이어야 합니다."
      );
      return;
    }

    //  비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    //  닉네임: 최소 3글자 이상
    if (formData.nickname.length < 3) {
      alert("닉네임은 3글자 이상이어야 합니다.");
      return;
    }

    //  생년월일 기본값 설정 (입력하지 않으면 2000-01-01)
    const birthDate = formData.birth_date ? formData.birth_date : "2000-01-01";

    const requestData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      nickname: formData.nickname,
      birth_date: birthDate,
      name: formData.name,
    };

    try {
      const response = await fetch("https://moonsunpower.com/user/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        setSuccess("회원가입이 완료되었습니다!");

        if (data.token) {
          localStorage.setItem("authToken", data.token);
          navigate("/");
        }
      } else {
        alert(data.detail || "회원가입 실패");
      }
    } catch (err) {
      alert("서버 요청 중 오류가 발생했습니다.");
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
            placeholder="아이디를 입력하세요. (영어 및 숫자 4~20자)"
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
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호 *</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력하세요. (영어,숫자,특수문자 모두 포함) "
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
            placeholder="닉네임을 입력하세요. (3글자 이상)"
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
