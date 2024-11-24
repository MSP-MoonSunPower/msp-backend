import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../logo.jpg";

function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchTodayText = async () => {
    try {
      const response = await fetch("https://moonsunpower.com/ai/todaytext/");
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No Content Found");
        }
        throw new Error("오늘의 지문 가져오기 실패");
      }
      const data = await response.json();
      console.log("오늘의 지문 가져오기 성공:", data);

      navigate("/Question", {
        state: { passage: data.content, questions: data.questions },
      });
    } catch (error) {
      console.error("오늘의 지문 가져오는 중 오류 발생:", error);
    }
  };

  if (isMobile) {
    return (
      <div className={styles.mobileContainer}>
        <h1 className={styles.title}>Moon Sun Power</h1>
        <p className={styles.mobileMessage}>PC를 이용한 학습을 권장합니다!</p>
        <div className={styles.buttonContainer}>
          <Link to="/select">
            <button className={styles.startButton}>시작하기</button>
          </Link>
          <Link to="#" onClick={fetchTodayText}>
            <button className={styles.questionButton}>
              오늘의 지문으로 바로 가기
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <img src={logo} alt="MSP Logo" className={styles.logoImage} />
      </div>
      <div className={styles.rightContainer}>
        <h1 className={styles.title}>Moon Sun Power</h1>
        <p className={styles.description}>
          생성형 AI 기반 NLG를 이용한 개인 맞춤형 문해력 향상 학습 프로그램
        </p>
        <div className={styles.buttonContainer}>
          <Link to="/select">
            <button className={styles.startButton}>시작하기</button>
          </Link>
          <Link to="#" onClick={fetchTodayText}>
            <button className={styles.questionButton}>
              오늘의 지문으로 바로 가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
