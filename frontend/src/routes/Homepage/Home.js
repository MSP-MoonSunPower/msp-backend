import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../../assets/msp-bear.png";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";

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
        <img src={logo} alt="MSP Logo" className={styles.logoImage} />
        <h1 className={styles.title}>Moon Sun Power</h1>
        <p className={styles.mobileMessage1}>
          개인 맞춤형 문해력 향상 학습 프로그램
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
        <p className={styles.mobileMessage2}>
          * 모바일 버전은 3월중 업데이트 예정입니다. (PC 학습 권장)
        </p>
      </div>
    );
  }
  return (
    <div>
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
      {/* ✅ sectionContainer를 올바른 위치로 이동 */}
      <div className={styles.sectionContainer}>
        <Section1 />
        <Section2 />
        <Section3 />
      </div>
      {/* ✅ footer도 container 내부에 유지 */}
      <footer className={styles.footer}>
        Contact :&nbsp;
        <a
          href="https://pf.kakao.com/_hdaKn"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          MSP 카카오 채널
        </a>
        &nbsp;|&nbsp;
        <span
          onClick={() => {
            window.open(
              "https://www.instagram.com/moonsunpower.sg/",
              "_blank",
              "noopener,noreferrer"
            );
          }}
          className={styles.footerLink}
        >
          Instagram
        </span>
      </footer>
    </div>
  );
}

export default Home;
