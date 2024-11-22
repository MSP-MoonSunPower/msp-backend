import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../logo.jpg";
import modal1 from "../modal1.jpg";
import modal2 from "../modal2.jpg";
import modal3 from "../modal3.jpg";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(1);
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentModal(1);
  };

  const closeModal = () => setIsModalOpen(false);

  const nextModal = () => {
    if (currentModal < 4) {
      setCurrentModal(currentModal + 1);
    } else {
      setCurrentModal(1);
    }
  };

  const previousModal = () => {
    if (currentModal > 1) {
      setCurrentModal(currentModal - 1);
    } else {
      setCurrentModal(4);
    }
  };

  // /todaytext/ 엔드포인트로 GET 요청
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Moon Sun Power </h1>

      <p className={styles.description}>
        생성형 AI 기반 NLG를 이용한 개인 맞춤형 문해력 향상 학습 프로그램인데
        이왕이면 노트북으로 들어와주세요.. bitte..
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

      <div className={styles.logoContainer}>
        <img
          src={logo}
          alt="Logo"
          className={styles.logo}
          onClick={openModal}
        />
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalButtons}>
              <button
                onClick={previousModal}
                className={`${styles.arrowButton} ${styles.left}`}
              >
                ⇦
              </button>
              {currentModal === 1 && (
                <div>
                  <h2>난이도 및 주제 선택</h2>
                  <img
                    src={modal1}
                    className={styles.modalImage}
                    alt="난이도 및 주제 선택"
                  />
                  <p>난이도와 주제를 자유롭게 선택할 수 있습니다!</p>
                </div>
              )}
              {currentModal === 2 && (
                <div>
                  <h2>문제 풀기</h2>
                  <img
                    src={modal2}
                    className={styles.modalImage}
                    alt="문제 풀기"
                  />
                  <p>문제를 풀고 실력을 확인해보세요!</p>
                </div>
              )}
              {currentModal === 3 && (
                <div>
                  <h2>솔루션 페이지</h2>
                  <img
                    src={modal3}
                    className={styles.modalImage}
                    alt="솔루션 페이지"
                  />
                  <p>해설을 보고 문제 풀이 방법을 학습하세요!</p>
                </div>
              )}
              {currentModal === 4 && (
                <div>
                  <h2>오늘의 지문!</h2>
                  <img
                    src={modal2}
                    className={styles.modalImage}
                    alt="오늘의 지문"
                  />
                  <p>오늘의 지문 난이도: 항상 고급!</p>
                </div>
              )}

              <button
                onClick={nextModal}
                className={`${styles.arrowButton} ${styles.right}`}
              >
                ⇨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
