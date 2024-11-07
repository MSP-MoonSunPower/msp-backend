import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Select.module.css";

function Select() {
  const [difficulty, setDifficulty] = useState(null);
  const [topic, setTopic] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  const handleDifficultyClick = (level) => {
    setDifficulty(level);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
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
            difficulty === "달인" ? styles.selected : ""
          }`}
          onClick={() => handleDifficultyClick("달인")}
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
        <Link to="/Question">
          <button className={styles.startButton}>시작하기</button>
          <button className={styles.questionButton}>오늘의 지문</button>
        </Link>
      </div>
    </div>
  );
}

export default Select;
