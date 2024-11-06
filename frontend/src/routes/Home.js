import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../logo.jpg";
import modal1 from "../modal1.jpg";
import modal2 from "../modal2.jpg";
import modal3 from "../modal3.jpg";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(1);

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentModal(1); // 첫 번째 모달부터 시작
  };

  const closeModal = () => setIsModalOpen(false);

  const nextModal = () => {
    if (currentModal < 4) {
      setCurrentModal(currentModal + 1);
    } else {
      setCurrentModal(1); // 네 번째 모달에서 첫 번째로 돌아가기
    }
  };

  const previousModal = () => {
    if (currentModal > 1) {
      setCurrentModal(currentModal - 1);
    } else {
      setCurrentModal(4); // 첫 번째 모달에서 네 번째로 돌아가기
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Moon Sun Power</h1>
      <p className={styles.description}>
        생성형 AI 기반 NLG를 이용한 개인 맞춤형 문해력 향상 학습 프로그램
      </p>
      <div className={styles.buttonContainer}>
        <Link to="/select">
          <button className={styles.startButton}>시작하기</button>
        </Link>
        <Link to="/question">
          <button className={styles.questionButton}>
            오늘의 지문으로 바로 가기
          </button>
        </Link>
      </div>
      <div style={{ marginTop: "30px", fontSize: "40px" }}>
        <span style={{ color: "red" }}>★</span>
        <span style={{ color: "orange" }}> Made </span>
        <span style={{ color: "yellow" }}>by.</span>
        <span style={{ color: "green" }}> 최환 </span>
        <span style={{ color: "blue" }}>안서진 </span>
        <span style={{ color: "indigo" }}>오승민 </span>
        <span style={{ color: "violet" }}>나윤재 </span>
        <span style={{ color: "red" }}>황세빈 </span>
        <span style={{ color: "orange" }}>★</span>
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
            {/* 모달 내용 */}
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
                  <p>난이도 및 주제 선택 가능</p>
                </div>
              )}
              {currentModal === 2 && (
                <div>
                  <h2>문제 풀기 </h2>
                  <img
                    src={modal2}
                    className={styles.modalImage}
                    alt="문제 풀기 "
                  />
                  <p>문제 풀 수 있</p>
                </div>
              )}
              {currentModal === 3 && (
                <div>
                  <h2>솔루션 페이지</h2>
                  <img
                    src={modal3}
                    className={styles.modalImage}
                    alt="난이도 및 주제 선택"
                  />
                  <p>문제에 대한 해설 </p>
                </div>
              )}
              {currentModal === 4 && (
                <div>
                  <h2>오늘의 지문!</h2>
                  <img
                    src={modal2}
                    className={styles.modalImage}
                    alt="문제 풀기 "
                  />
                  <p>오늘의 지문 난이도 : 항상 고급</p>
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
