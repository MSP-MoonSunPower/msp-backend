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
    if (e.target.value) {
      setSelectedTag(null); // 사용자가 주제를 입력하면 태그 선택 해제
    }
  };

  // 태그 클릭 핸들러
  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // 이미 선택된 태그를 다시 클릭하면 해제
    } else {
      setSelectedTag(tag);
      setTopic(""); // 사용자가 태그를 클릭하면 주제 입력 필드 비우기
    }
  };

  // 서버로 데이터 전송하는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedTopic = topic || selectedTag; // 사용자가 입력한 주제나 선택한 태그를 사용

    // 필수 필드 확인
    if (!difficulty || !selectedTopic) {
      console.error("난이도와 주제를 모두 선택해주세요.");
      return;
    }

    try {
      // POST 요청으로 서버에 데이터 전송
      const response = await fetch("http://localhost:3000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          difficulty,
          topic: selectedTopic,
        }),
      });

      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      const result = await response.json();
      console.log("서버 응답:", result);

      navigate("/Question", {
        state: { passage: result.passage, question: result.question },
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
      {/* 주제 입력 필드: 태그가 선택되면 비활성화 */}
      <input
        type="text"
        className={styles.topicInput}
        placeholder="원하는 주제를 입력해주세요. (ex. 옥토버페스트)"
        value={topic}
        onChange={handleTopicChange}
        disabled={!!selectedTag} // 태그가 선택되었을 경우 비활성화
      />

      <h3>원하는 주제가 없으신가요?</h3>
      {/* 태그 선택: 주제가 입력되면 비활성화 */}
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
            style={{ pointerEvents: topic ? "none" : "auto" }} // 주제가 입력되었을 경우 클릭 비활성화
          >
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.startButton} onClick={handleSubmit}>
          시작하기
        </button>
        <Link to="/Question">
          <button className={styles.questionButton}>오늘의 지문</button>
        </Link>
      </div>
    </div>
  );
}

export default Select;
