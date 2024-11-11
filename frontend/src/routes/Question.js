import React, { useState, useEffect } from "react";
import styles from "./Question.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../logo.jpg";

const Question = () => {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(5).fill(null));
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [highlightedText, setHighlightedText] = useState("");
  const navigate = useNavigate();
  const [showFullPassage, setShowFullPassage] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [elapsedTime, setElapsedTime] = useState("");
  const [intervalId, setIntervalId] = useState(null); // 타이머 ID 저장 상태

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOptionChange = (questionIndex, answer) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    startTimer(); // 타이머 시작
    return () => stopTimer(); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const handleSubmit = () => {
    stopTimer(); // 타이머 멈추기
    const elapsedMinutes = Math.floor(seconds / 60);
    const elapsedDisplaySeconds = seconds % 60;
    setElapsedTime(`${elapsedMinutes}분 ${elapsedDisplaySeconds}초`);
    setShowPopup(true);
  };

  const handleConfirm = () => {
    navigate("/Solution");
  };

  const handleCancel = () => {
    setShowPopup(false);
    startTimer(); // 타이머 다시 시작
  };

  const handleShowFullPassage = () => {
    setShowFullPassage(true);
  };

  const handleCloseFullPassage = () => {
    setShowFullPassage(false);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text && !highlightedWords.includes(text)) {
      setHighlightedWords((prevWords) => [...prevWords, text]);
      highlightSelectedText();
    }
  };

  const highlightSelectedText = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.className = styles.highlight;
      span.textContent = selection.toString();
      range.deleteContents();
      range.insertNode(span);
      selection.removeAllRanges();
    }
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  const handleDeleteWord = (index) => {
    setHighlightedWords((prevWords) => prevWords.filter((_, i) => i !== index));
  };

  const questions = [
    {
      question: "루프트한자가 설립된 해는 언제인가요?",
      options: ["1910", "1926", "1945", "1953", "1960"],
    },
    {
      question: "루프트한자의 본사는 어느 도시에 위치해 있나요?",
      options: ["베를린", "뮌헨", "프랑크푸르트", "함부르크", "쾰른"],
    },
    {
      question:
        "스타 얼라이언스와 관련하여 루프트한자는 어떤 역할을 하고 있나요?",
      options: [
        "회원이 아닌 독립 항공사",
        "스타 얼라이언스를 탈퇴한 항공사",
        "창립 멤버",
        "바람이 부는 날",
        "비공식 파트너",
      ],
    },
    {
      question: "루프트한자는 어떤 방법으로 환경 보호에 기여하고 있나요?",
      options: [
        "더 많은 항공편을 운영하여 상업적 이익 증가",
        "오래된 항공기 유지",
        "최신 항공기 도입과 연료 효율성 기술 사용",
        "서비스 품질 개선에 중점",
        "내부 비용 절감을 위한 조치",
      ],
    },
    {
      question:
        "루프트한자가 두 시기로 나뉜 것 중 제2차 세계대전 이후의 시기는 몇 년부터 시작됐나요?",
      options: ["1926년", "1945년", "1953년", "1980년", "2000년"],
    },
  ];

  return (
    <div className={styles.container} onMouseUp={handleMouseUp}>
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
                  <button
                    onClick={closeModal}
                    className={styles.closeButton}
                  ></button>
                </div>
              </div>
            )}

            <div className={styles.Jimoon}>
              <p>
                루프트한자(Lufthansa)는 독일의 대표적인 항공사로, 세계적으로도
                잘 알려진 항공사 중 하나입니다. 이 항공사는 1926년에
                설립되었으며, 본사는 독일의 프랑크푸르트에 위치하고 있습니다.
                루프트한자는 유럽은 물론 전 세계를 연결하는 항공 노선을 운영하고
                있으며, 국제 항공업계에서 중요한 위치를 차지하고 있습니다.
                루프트한자의 역사는 두 부분으로 나눌 수 있습니다.
              </p>
              <p>
                첫 번째는 1926년부터 1945년까지의 초기 시기이고, 두 번째는 제2차
                세계대전 이후인 1953년부터 현재까지의 현대 시기입니다. 초기
                시기에는 주로 유럽 내 단거리 운항을 주로 하였고, 대전 이후에는
                국제선 운항이 확대되었습니다. 현대의 루프트한자는 300대 이상의
                항공기를 보유하고 있으며, 스타 얼라이언스(Star Alliance)의 창립
                회원국 중 하나로서, 많은 다른 국제 항공사들과 연합하여 고객에게
                더욱 다양한 목적지를 제공하고 있습니다.
              </p>
              <p>
                루프트한자의 서비스는 높은 수준의 안전성과 편안함으로 잘 알려져
                있습니다. 비즈니스 클래스와 일등석에서는 더욱 특별한 서비스와
                편안한 좌석을 제공하여, 고객의 만족도를 높이고자 노력하고
                있습니다. 또한, 지속 가능한 항공 업계를 위해 다양한 환경 보호
                정책을 시행하고 있습니다. 최신 항공기 도입과 연료 효율성을
                높이는 기술을 사용하여 탄소 배출량을 줄이려는 노력을 계속하고
                있습니다.
              </p>
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
            <div className={styles.FullJimoon}>
              <p>
                루프트한자(Lufthansa)는 독일의 대표적인 항공사로, 세계적으로도
                잘 알려진 항공사 중 하나입니다. 이 항공사는 1926년에
                설립되었으며, 본사는 독일의 프랑크푸르트에 위치하고 있습니다.
                루프트한자는 유럽은 물론 전 세계를 연결하는 항공 노선을 운영하고
                있으며, 국제 항공업계에서 중요한 위치를 차지하고 있습니다.
                루프트한자의 역사는 두 부분으로 나눌 수 있습니다.
              </p>
              <p>
                첫 번째는 1926년부터 1945년까지의 초기 시기이고, 두 번째는 제2차
                세계대전 이후인 1953년부터 현재까지의 현대 시기입니다. 초기
                시기에는 주로 유럽 내 단거리 운항을 주로 하였고, 대전 이후에는
                국제선 운항이 확대되었습니다. 현대의 루프트한자는 300대 이상의
                항공기를 보유하고 있으며, 스타 얼라이언스(Star Alliance)의 창립
                회원국 중 하나로서, 많은 다른 국제 항공사들과 연합하여 고객에게
                더욱 다양한 목적지를 제공하고 있습니다.
              </p>
              <p>
                루프트한자의 서비스는 높은 수준의 안전성과 편안함으로 잘 알려져
                있습니다. 비즈니스 클래스와 일등석에서는 더욱 특별한 서비스와
                편안한 좌석을 제공하여, 고객의 만족도를 높이고자 노력하고
                있습니다. 또한, 지속 가능한 항공 업계를 위해 다양한 환경 보호
                정책을 시행하고 있습니다. 최신 항공기 도입과 연료 효율성을
                높이는 기술을 사용하여 탄소 배출량을 줄이려는 노력을 계속하고
                있습니다.
              </p>
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
                <p>{item.question}</p>
                {item.options.map((option, optionIndex) => (
                  <div key={optionIndex} className={styles.option}>
                    <input
                      className={styles.radioBtn}
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={selectedAnswers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                    />
                    <label className={styles.checked}>{option}</label>
                  </div>
                ))}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <button className={styles.submitButton} onClick={handleSubmit}>
        답안 제출하기
      </button>

      {showPopup && (
        <div className={styles.popup}>
          <p>정말 제출하시겠습니까?</p>
          <p>소요 시간: {elapsedTime}</p> {/* 소요 시간 표시 */}
          <div>
            <button onClick={handleCancel} className={styles.cancelButton}>
              뒤로 가기
            </button>
            <button onClick={handleConfirm} className={styles.confirmButton}>
              제출하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
