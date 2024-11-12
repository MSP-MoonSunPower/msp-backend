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
  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // 이미 선택된 태그를 다시 클릭하면 해제
    } else {
      setSelectedTag(tag);
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
      // 사용자가 입력한 주제가 있을 경우 /text/{subject}/{difficulty} 요청
      try {
        const response = await fetch(
          `http://localhost:3000/text/${topic}/${difficulty}`
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
      // 선택된 태그가 있을 경우 /tagtext/{subject}/{difficulty} 요청
      try {
        const response = await fetch(
          `http://localhost:3000/tagtext/${selectedTag}/${difficulty}`
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
      const response = await fetch("http://localhost:3000/todaytext/");
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
      {/* 초급, 중급, 고급, 지옥 = 각각 1, 2, 3, 4로 전달 (int) */}
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
