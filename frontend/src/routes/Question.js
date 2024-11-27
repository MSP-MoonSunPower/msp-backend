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
  const [errorPopup, setErrorPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { passage, questions } = location.state || {
    passage: "",
    questions: [],
  };
  const passageRef = useRef(null);
  const timerRef = useRef(null);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

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
  const handleMouseUp = (event) => {
    const jimoonElement = passageRef.current;

    if (jimoonElement && jimoonElement.contains(event.target)) {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (!text) return;

      const range = selection.getRangeAt(0);
      const startNode = range.startContainer;
      const endNode = range.endContainer;

      // 에러1. 문단 넘어서는 선택
      if (startNode !== endNode) {
        setErrorPopup(true);
        selection.removeAllRanges();
        return;
      }

      // 에러 2. 텍스트 길이가 22자 이상인 경우
      if (text.length > 22) {
        setErrorPopup(true);
        selection.removeAllRanges();
        return;
      }

      if (text && !highlightedWords.some((hw) => hw.word === text)) {
        const newWord = { word: text, index: highlightedWords.length };
        setHighlightedWords((prevWords) => [...prevWords, newWord]);
        applyStylesToText(selection, "green", "bold", newWord.index);
        selection.removeAllRanges();
      }
    }
  };

  const applyStylesToText = (selection, color, fontWeight, index) => {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (selectedText.trim() !== "") {
      const span = document.createElement("span");
      span.style.color = color;
      span.style.fontWeight = fontWeight;
      span.dataset.index = index;
      span.textContent = selectedText;

      try {
        range.deleteContents();
        range.insertNode(span);
      } catch (error) {
        console.error("Error applying styles to text:", error);
      }
    }
  };

  const removeStylesFromText = (wordToRemove, indexToRemove) => {
    const spans = passageRef.current?.querySelectorAll("span");
    if (spans) {
      spans.forEach((span) => {
        if (
          span.textContent === wordToRemove &&
          parseInt(span.dataset.index, 10) === indexToRemove
        ) {
          const parent = span.parentNode;
          if (parent) {
            parent.replaceChild(
              document.createTextNode(span.textContent),
              span
            );
            parent.normalize();
          }
        }
      });
    }
  };

  const handleResetAll = () => {
    const spans = passageRef.current?.querySelectorAll("span");
    if (spans) {
      spans.forEach((span) => {
        const parent = span.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(span.textContent), span);
          parent.normalize();
        }
      });
    }
  };

  const handleDeleteWord = (index) => {
    const { word } = highlightedWords[index];
    removeStylesFromText(word, index); // 본문 스타일 제거
    setHighlightedWords((prevWords) => prevWords.filter((_, i) => i !== index)); // 단어장에서 삭제
  };

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
          unknown_words: highlightedWords.map((hw) => hw.word),
          difficulty: 1,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch word definitions from the API");
      }
      const data = await response.json();
      const wordDefinitions = data.definitions?.words || [];
      navigate("/Solution", {
        state: {
          passage,
          questions,
          selectedAnswers,
          elapsedTime,
          vocabulary: highlightedWords.map((hw) => hw.word),
          wordDefinitions,
        },
      });
    } catch (error) {
      console.error("Error fetching word definitions:", error);
      navigate("/Solution", {
        state: {
          passage,
          questions,
          selectedAnswers,
          elapsedTime,
          vocabulary: highlightedWords.map((hw) => hw.word),
          wordDefinitions: [],
        },
      });
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setIsTimerRunning(true);
    startTimer();
  };

  const handleOpenPopup = () => {
    const elapsedMinutes = Math.floor(seconds / 60);
    const elapsedDisplaySeconds = seconds % 60;
    setElapsedTime(`${elapsedMinutes}분 ${elapsedDisplaySeconds}초`);
    setShowPopup(true);
    stopTimer();
  };

  const formattedPassage = passage
    .split("\n\n")
    .map((para, index) => <p key={index}>{para}</p>);

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
              <button className={styles.WordBtn} onClick={toggleModal}>
                모르는 단어
              </button>
              <button
                onClick={() => setShowFullPassage(true)}
                className={styles.showPassageButton}
              >
                지문만 보기
              </button>
              <button onClick={handleResetAll} className={styles.resetButton}>
                Reset
              </button>
            </div>
            {isModalOpen && (
              <div className={styles.modalOverlay} onClick={toggleModal}>
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className={styles.modalHeader}>모르는 단어</h3>
                  <ul className={styles.wordList}>
                    {highlightedWords.map((hw, index) => (
                      <li key={index} className={styles.wordItem}>
                        {index + 1}. {hw.word}
                        <button
                          onClick={() => handleDeleteWord(index)}
                          className={styles.deleteButton}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button onClick={toggleModal} className={styles.closeButton}>
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
              onClick={() => setShowFullPassage(false)}
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
                  <div
                    key={optionIndex}
                    className={styles.option}
                    onClick={() => handleOptionChange(index, optionIndex)}
                  >
                    <input
                      className={styles.radioBtn}
                      type="radio"
                      name={`question-${index}`}
                      value={optionIndex + 1}
                      checked={selectedAnswers[index] === optionIndex + 1}
                      onChange={() => {}}
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
            <p className={styles.popupWarning}>소요 시간: {elapsedTime}</p>
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
      {errorPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <p>올바른 단어가 아닙니다.</p>
            <button
              onClick={() => setErrorPopup(false)}
              className={styles.closeButton}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
