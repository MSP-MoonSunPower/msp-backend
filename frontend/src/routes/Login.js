import React, { useState } from "react";
import styles from "./Login.module.css";
import logo from "../logo.jpg";

function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const clear = () => {
    setId("");
    setPw("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>

      <h2>문해력 향상 프로그램</h2>

      <input
        name="id"
        className={styles.inputBox}
        placeholder="아이디를 입력하세요."
        value={id}
        onChange={(e) => setId(e.target.value)}
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "아이디를 입력하세요.")}
      />
      <input
        name="pw"
        type="password"
        className={styles.inputBox}
        placeholder="비밀번호를 입력하세요"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "비밀번호를 입력하세요")}
      />

      <button className={styles.Button} onClick={clear}>
        로그인 하기
      </button>

      <h6 className={styles.signup}>회원가입하기</h6>
    </div>
  );
}

export default Login;
