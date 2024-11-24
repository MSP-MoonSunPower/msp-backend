import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Question.module.css";
import { useNavigate, useLocation } from "react-router-dom";

const Question = () => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [showFullPassage, setShowFullPassage] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [elapsedTime, setElapsedTime] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { passage, questions } = location.state || {
    passage: "",
    questions: [],
  };

  const passageRef = useRef(null);
  const timerRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOptionChange = (questionIndex, answerIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = answerIndex + 1;
    setSelectedAnswers(updatedAnswers);
  };

  const startTimer = useCallback(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
  }, [isTimerRunning]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer]);

  const handleSubmit = async () => {
    setIsTimerRunning(false);
    stopTimer();
    try {
      const response = await fetch("https://moonsunpower.com/ai/words/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unknown_words: highlightedWords,
          difficulty: 1,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch word definitions from the API");
      }
      const data = await response.json();
      console.log("API 응답:", data);
      const wordDefinitions = data.definitions.words || [];
      navigate("/Solution", {
        state: {
          passage,
          questions,
          selectedAnswers,
          elapsedTime,
          vocabulary: highlightedWords,
          wordDefinitions,
        },
      });
    } catch (error) {
      console.error("Error fetching word definitions:", error);
      setShowPopup(true);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setIsTimerRunning(true);
    startTimer();
  };

  const handleShowFullPassage = () => setShowFullPassage(true);
  const handleCloseFullPassage = () => setShowFullPassage(false);

  const handleMouseUp = (event) => {
    const jimoonElement = passageRef.current;
    if (jimoonElement && jimoonElement.contains(event.target)) {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      if (text && !highlightedWords.includes(text)) {
        setHighlightedWords((prevWords) => [...prevWords, text]);
        highlightSelectedText();
      }
    }
  };

  const highlightSelectedText = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();

      if (selectedText.trim() !== "") {
        const span = document.createElement("span");
        span.className = styles.highlight;
        span.textContent = selectedText;

        try {
          range.deleteContents();
          range.insertNode(span);
          selection.removeAllRanges();
        } catch (error) {
          console.error("Error highlighting text:", error);
        }
      }
    }
  };

  const removeHighlight = (word) => {
    const highlights = passageRef.current?.querySelectorAll(
      `.${styles.highlight}`
    );
    if (highlights) {
      highlights.forEach((highlight) => {
        if (highlight.textContent === word) {
          const parent = highlight.parentNode;
          if (parent) {
            parent.replaceChild(
              document.createTextNode(highlight.textContent),
              highlight
            );
            parent.normalize();
          }
        }
      });
    }
  };

  const handleDeleteWord = (index) => {
    setHighlightedWords((prevWords) => {
      const newWords = prevWords.filter((_, i) => i !== index);
      removeHighlight(prevWords[index]);
      return newWords;
    });
  };

  const formattedPassage = passage
    .split("\n\n")
    .map((para, index) => <p key={index}>{para}</p>);

  const handleOpenPopup = () => {
    const elapsedMinutes = Math.floor(seconds / 60);
    const elapsedDisplaySeconds = seconds % 60;
    setElapsedTime(`${elapsedMinutes}분 ${elapsedDisplaySeconds}초`);
    setShowPopup(true);
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {!showFullPassage ? (
          <div className={styles.passage}>
            <div style={{ color: "grey", marginBottom: "15px" }}>
              * 모르는 단어가 있으면 클릭해두고, 해설창에서 확인하세요!
            </div>
            <div style={{ fontWeight: "bold" }}>
              [1-5] 다음 글을 읽고 질문에 답하시오.
            </div>
            <div className={styles.BTNs}>
              <button className={styles.WordBtn} onClick={openModal}>
                모르는 단어
              </button>
              <button
                onClick={handleShowFullPassage}
                className={styles.showPassageButton}
              >
                지문만 보기
              </button>
            </div>
            {isModalOpen && (
              <div className={styles.modalOverlay} onClick={closeModal}>
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className={styles.modalHeader}>모르는 단어</h3>
                  <ul className={styles.wordList}>
                    {highlightedWords.map((word, index) => (
                      <li key={index} className={styles.wordItem}>
                        {index + 1}. {word}
                        <button
                          onClick={() => handleDeleteWord(index)}
                          className={styles.deleteButton}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button onClick={closeModal} className={styles.closeButton}>
                    닫기
                  </button>
                </div>
              </div>
            )}
            <div
              className={styles.Jimoon}
              ref={passageRef}
              onMouseUp={handleMouseUp}
            >
              {formattedPassage}
            </div>
          </div>
        ) : (
          <div className={styles.fullPassage}>
            <button
              onClick={handleCloseFullPassage}
              className={styles.CloseFullPassageBTN}
            >
              문제로 돌아가기
            </button>
            <div
              className={styles.FullJimoon}
              ref={passageRef}
              onMouseUp={handleMouseUp}
            >
              {formattedPassage}
            </div>
          </div>
        )}
        <div className={styles.questions}>
          <div className={styles.Timer}>
            {isVisible && (
              <h1>
                {minutes}:
                {displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds}
              </h1>
            )}
          </div>
          <button
            className={styles.timerBTN}
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? "HIDE" : "SHOW"}
          </button>
          <ol>
            {questions.map((item, index) => (
              <li key={index}>
                <p>{item.question_text}</p>
                {[
                  item.choice1,
                  item.choice2,
                  item.choice3,
                  item.choice4,
                  item.choice5,
                ].map((option, optionIndex) => (
                  <div key={optionIndex} className={styles.option}>
                    <input
                      className={styles.radioBtn}
                      type="radio"
                      name={`question-${index}`}
                      value={optionIndex + 1}
                      checked={selectedAnswers[index] === optionIndex + 1}
                      onChange={() => handleOptionChange(index, optionIndex)}
                    />
                    <label className={styles.checked}>{option}</label>
                  </div>
                ))}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <button className={styles.submitButton} onClick={handleOpenPopup}>
        답안 제출하기
      </button>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <p className={styles.popupTitle}>정말 제출하시겠습니까?</p>
            <p className={styles.popupWarning}>
              모르는 단어 하나 이상 선택해주셔야 제출이 됩니다.. (수정중~)
            </p>
            <p className={styles.popupTime}>소요 시간: {elapsedTime}</p>
            <div className={styles.popupButtons}>
              <button onClick={handleCancel} className={styles.cancelButton}>
                뒤로 가기
              </button>
              <button onClick={handleSubmit} className={styles.confirmButton}>
                제출하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
