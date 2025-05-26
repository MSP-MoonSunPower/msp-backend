import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ClockLoader from "react-spinners/ClockLoader";
import styles from "./Select.module.css";

function Select() {
  const API_BASE =
    window.location.hostname === "test.moonsunpower.com"
      ? "https://test.moonsunpower.com"
      : "https://moonsunpower.com";

  const [difficulty, setDifficulty] = useState(null);
  const [topic, setTopic] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("korean");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  const handleDifficultyClick = (level) => {
    setDifficulty(level);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    if (e.target.value) {
      setSelectedTag(null);
    }
  };

  const handleTagClick = (tagNumber) => {
    if (selectedTag === tagNumber) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagNumber);
      setTopic("");
    }
  };

  const handleStartClick = async () => {
    if (!difficulty) {
      setError("난이도를 선택해주세요.");
      setIsPopupOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    if (topic) {
      try {
        const response = await fetch(
          `${API_BASE}/ai/text/${encodeURIComponent(
            topic
          )}/${difficulty}/${selectedLanguage}`
        );
        if (!response.ok) {
          throw new Error("텍스트 가져오기 실패");
        }
        const data = await response.json();
        navigate("/Question", {
          state: { passage: data.content, questions: data.questions },
        });
      } catch (error) {
        setError("지문 생성에 실패했습니다. 주제를 다시 선택해주세요.");
        setIsPopupOpen(true);
      } finally {
        setIsLoading(false);
      }
    } else if (selectedTag) {
      try {
        const response = await fetch(
          `${API_BASE}/ai/tagtext/${selectedTag}/${difficulty}`
        );
        if (!response.ok) {
          throw new Error("태그 텍스트 가져오기 실패");
        }
        const data = await response.json();
        navigate("/Question", {
          state: { passage: data.content, questions: data.questions },
        });
      } catch (error) {
        setError("지문 생성에 실패했습니다. 주제를 다시 선택해주세요.");
        setIsPopupOpen(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("주제 또는 태그를 선택해주세요.");
      setIsPopupOpen(true);
      setIsLoading(false);
    }
  };

  const fetchTodayText = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/ai/todaytext/`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No Content Found");
        }
        throw new Error("오늘의 지문 가져오기 실패");
      }
      const data = await response.json();
      navigate("/Question", {
        state: { passage: data.content, questions: data.questions },
      });
    } catch (error) {
      setError("오늘의 지문을 가져오는데 실패했습니다. 다시 시도해주세요.");
      setIsPopupOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ClockLoader color="black" size={80} />
        <p className={styles.waittext}>
          지문이 생성되고 있습니다. 잠시만 기다려주세요!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isPopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <p>{error}</p>
            <button onClick={() => setIsPopupOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      <div className={styles.languageChoice}>
        {[
          { label: "한글 (Korean)", value: "korean" },
          { label: "영어 (English)", value: "english" },
          { label: "독일어 (Deutsch)", value: "german" },
        ].map((lang) => (
          <button
            key={lang.value}
            onClick={() => setSelectedLanguage(lang.value)}
            className={`${styles.languageButton} ${
              selectedLanguage === lang.value ? styles.selected : ""
            }`}
          >
            {lang.label}
          </button>
        ))}

        <button langBtn="프랑스어는 6월부터 이용하실 수 있습니다!">
          프랑스어 (Français)
        </button>
        <button langBtn="스페인어는 6월부터 이용하실 수 있습니다!">
          스페인어 (Español)
        </button>
      </div>

      <h2>✔️ 지문 난이도 </h2>
      <div className={styles.difficultyOptions}>
        {["1", "2", "3", "4"].map((level, index) => (
          <button
            key={level}
            className={`${styles.difficultyButton} ${
              difficulty === level ? styles.selected : ""
            }`}
            onClick={() => handleDifficultyClick(level)}
          >
            {["초급", "중급", "고급", "지옥"][index]}
          </button>
        ))}
      </div>

      <h2>✔️ 지문 주제 </h2>
      <input
        type="text"
        className={styles.topicInput}
        placeholder="원하는 주제를 입력해주세요. (ex. 옥토버페스트)"
        value={topic}
        onChange={handleTopicChange}
        disabled={!!selectedTag}
      />

      {selectedLanguage === "korean" && (
        <>
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
                onClick={() => {
                  if (selectedLanguage === "korean" && !topic) {
                    handleTagClick(tag.number);
                  }
                }}
                style={{
                  pointerEvents:
                    selectedLanguage !== "korean" || topic ? "none" : "auto",
                  opacity: selectedLanguage !== "korean" || topic ? 0 : 1,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </>
      )}

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
