import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Select.module.css";

function Select() {
  const [difficulty, setDifficulty] = useState(null);
  const [topic, setTopic] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // 난이도 버튼 클릭 핸들러
  const handleDifficultyClick = (level) => {
    setDifficulty(level);
  };

  // 주제 입력 핸들러
  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  // 태그 클릭 핸들러
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  // 서버로 데이터 전송하는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedTopic = topic || selectedTag; // 입력된 주제 또는 선택된 태그 사용

    // 서버로 보낼 데이터
    const data = {
      difficulty,
      topic: selectedTopic,
    };

    try {
      // POST 요청으로 서버에 데이터 전송
      const response = await fetch("http://localhost:3000/api/submit", {
        method: "POST", // HTTP 메서드: POST (데이터를 서버에 보낼 때 사용)
        headers: {
          "Content-Type": "application/json", // 요청 본문이 JSON 형식임을 명시
        },
        body: JSON.stringify(data), // 데이터 객체를 JSON 문자열로 변환하여 본문에 포함
      });

      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      // 서버에서 받은 지문과 문제 데이터
      const result = await response.json();
      console.log("서버 응답:", result);

      navigate("/Question", {
        state: { passage: result.passage, question: result.question },
        //  /Question 경로로 이동하면서 서버에서 받은 지문(passage)과 문제(question) 데이터를 함께 전달
      });
    } catch (error) {
      console.error("데이터 전송 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>1. 난이도 선택</h2>
      <div className={styles.difficultyOptions}>
        <button
          className={`${styles.difficultyButton} ${
            difficulty === "초급" ? styles.selected : ""
          }`}
          onClick={() => handleDifficultyClick("초급")}
        >
          초급
        </button>
        <button
          className={`${styles.difficultyButton} ${
            difficulty === "중급" ? styles.selected : ""
          }`}
          onClick={() => handleDifficultyClick("중급")}
        >
          중급
        </button>
        <button
          className={`${styles.difficultyButton} ${
            difficulty === "고급" ? styles.selected : ""
          }`}
          onClick={() => handleDifficultyClick("고급")}
        >
          고급
        </button>
        <button
          className={`${styles.difficultyButton} ${
            difficulty === "지옥" ? styles.selected : ""
          }`}
          onClick={() => handleDifficultyClick("지옥")}
        >
          지옥
        </button>
      </div>

      <h2>2. 주제 선택</h2>
      <input
        type="text"
        className={styles.topicInput}
        placeholder="원하는 주제를 입력해주세요. (ex. 옥토버페스트)"
        value={topic}
        onChange={handleTopicChange}
      />

      <h3>원하는 주제가 없으신가요?</h3>
      <div className={styles.tagContainer}>
        {[
          "스포츠 / 예술",
          "철학",
          "사회 / 경제",
          "과학 / 기술",
          "문학",
          "역사",
        ].map((tag) => (
          <span
            key={tag}
            className={`${styles.tag} ${
              selectedTag === tag ? styles.selectedTag : ""
            }`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.buttons}>
        {/* 시작하기 버튼 클릭 시 서버로 데이터 전송 */}

        <button className={styles.startButton} onClick={handleSubmit}>
          시작하기
        </button>
        {/* 오늘의 지문 버튼 */}
        <Link to="/Question">
          <button className={styles.questionButton}>오늘의 지문</button>
        </Link>
      </div>
    </div>
  );
}

export default Select;
