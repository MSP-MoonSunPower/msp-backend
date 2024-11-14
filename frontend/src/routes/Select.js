import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Select.module.css";

function Select() {
  const [difficulty, setDifficulty] = useState(null);
  const [topic, setTopic] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

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
  const handleTagClick = (tagNumber) => {
    if (selectedTag === tagNumber) {
      setSelectedTag(null); // 이미 선택된 태그를 다시 클릭하면 해제
    } else {
      setSelectedTag(tagNumber);
      setTopic(""); // 사용자가 태그를 클릭하면 주제 입력 필드 비우기
    }
  };

  // 시작하기 버튼 클릭 시 호출되는 함수
  const handleStartClick = async () => {
    if (!difficulty) {
      console.error("난이도를 선택해주세요.");
      return;
    }

    if (topic) {
      try {
        const response = await fetch(
          `http://3.38.179.92/ai/text/${encodeURIComponent(
            topic
          )}/${difficulty}`
        );
        if (!response.ok) {
          throw new Error("텍스트 가져오기 실패");
        }
        const data = await response.json();
        console.log("텍스트 가져오기 성공:", data);

        navigate("/Question", {
          state: { passage: data.content, questions: data.questions },
        });
      } catch (error) {
        console.error("텍스트 가져오는 중 오류 발생:", error);
      }
    } else if (selectedTag) {
      try {
        const response = await fetch(
          `http://3.38.179.92/ai/text/${selectedTag}/${difficulty}`
        );
        if (!response.ok) {
          throw new Error("태그 텍스트 가져오기 실패");
        }
        const data = await response.json();
        console.log("태그 텍스트 가져오기 성공:", data);

        navigate("/Question", {
          state: { passage: data.content, questions: data.questions },
        });
      } catch (error) {
        console.error("태그 텍스트 가져오는 중 오류 발생:", error);
      }
    } else {
      console.error("주제 또는 태그를 선택해주세요.");
    }
  };

  // /todaytext/ 엔드포인트로 GET 요청
  const fetchTodayText = async () => {
    try {
      const response = await fetch("http://3.38.179.92/ai/todaytext/");
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
      <h2>1. 난이도 선택</h2>
      <div className={styles.difficultyOptions}>
        <button
          className={`${styles.difficultyButton} ${
            difficulty === "1" ? styles.selected : ""
          }`}
          onClick={() => handleDifficultyClick("1")}
        >
          초급
        </button>
        <button
          className={`${styles.difficultyButton} ${
            difficulty === "2" ? styles.selected : ""
          }`}
          onClick={() => handleDifficultyClick("2")}
        >
          중급
        </button>
        <button
          className={`${styles.difficultyButton} ${
            difficulty === "3" ? styles.selected : ""
          }`}
          onClick={() => handleDifficultyClick("3")}
        >
          고급
        </button>
        <button
          className={`${styles.difficultyButton} ${
            difficulty === "4" ? styles.selected : ""
          }`}
          onClick={() => handleDifficultyClick("4")}
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
        disabled={!!selectedTag}
      />

      <h3>원하는 주제가 없으신가요?</h3>
      <div className={styles.tagContainer}>
        {[
          { label: "스포츠 / 예술", number: 1 },
          { label: "철학", number: 2 },
          { label: "사회 / 경제", number: 3 },
          { label: "과학 / 기술", number: 4 },
          { label: "문학", number: 5 },
          { label: "역사", number: 6 },
        ].map((tag) => (
          <span
            key={tag.number}
            className={`${styles.tag} ${
              selectedTag === tag.number ? styles.selectedTag : ""
            }`}
            onClick={() => handleTagClick(tag.number)}
            style={{ pointerEvents: topic ? "none" : "auto" }}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.startButton} onClick={handleStartClick}>
          시작하기
        </button>
        <Link to="#" onClick={fetchTodayText}>
          <button className={styles.questionButton}>오늘의 지문</button>
        </Link>
      </div>
    </div>
  );
}

export default Select;
