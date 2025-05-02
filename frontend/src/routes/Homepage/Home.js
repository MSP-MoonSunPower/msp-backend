import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../../assets/jamLogo.png";
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
        <h1 className={styles.title}>Meokgi Siro Paprika~</h1>
        <p className={styles.mobileMessage1}>
        문썬파워 하나 풀고 돈까스 묵으러 가자!!
        </p>

        <div className={styles.buttonContainer}>
          <Link to="/select">
            <button className={styles.startButton}>허거덩거덩스~</button>
          </Link>
          <Link to="#" onClick={fetchTodayText}>
            <button className={styles.questionButton}>
            오늘 숙제 (짱중요)
            </button>
          </Link>
        </div>
        <p className={styles.mobileMessage2}>
          PC로 들어와주세요 ㅠㅠ 🥕🥕🥕
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
          <h1 className={styles.title}>Meokgi Siro Paprika~</h1>
          <p className={styles.description}>
            문썬파워 하나 풀고 돈까스 묵으러 가자!!
          </p>
          <div className={styles.buttonContainer}>
            <Link to="/select">
              <button className={styles.startButton}>허거덩거덩스~</button>
            </Link>
            <Link to="#" onClick={fetchTodayText}>
              <button className={styles.questionButton}>
                오늘 숙제 (짱중요)
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.sectionContainer}>
        <Section2 />
        <Section1 />

        <Section3 />
      </div>

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
