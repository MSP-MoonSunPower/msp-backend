import React, { useState } from "react";
import styles from "./Question.module.css";
import { Link, useNavigate } from "react-router-dom";

const Question = () => {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(5).fill(null));
  const [showPopup, setShowPopup] = useState(false); // 팝업창 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트

  const [showFullPassage, setShowFullPassage] = useState(false); // 지문만 보기

  const handleOptionChange = (questionIndex, answer) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    setShowPopup(true); // 팝업창 표시
  };

  const handleConfirm = () => {
    // "확인" 버튼을 누르면 Solution.js로 이동
    navigate("/Solution");
  };

  const handleCancel = () => {
    // "취소" 버튼을 누르면 팝업창 닫기
    setShowPopup(false);
  };

  const handleShowFullPassage = () => {
    setShowFullPassage(true);
  };

  const handleCloseFullPassage = () => {
    setShowFullPassage(false);
  };

  const questions = [
    {
      question: "1. 순대국밥의 주요 재료는 무엇인가요?",
      options: ["치킨", "돼지고기와 순대", "생선", "소고기", "야채"],
    },
    {
      question: "순대는 무엇으로 만들어지나요?",
      options: ["꽃", "밀가루", "돼지 창자, 찹쌀, 야채", "치즈", "과일"],
    },
    {
      question: "순대국밥은 어떤 날씨에 특히 좋을까요?",
      options: [
        "더운 날",
        "비 오는 날",
        "추운 날",
        "바람이 부는 날",
        "건조한 날",
      ],
    },
  ];

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
            <button
              onClick={handleShowFullPassage}
              className={styles.showPassageButton}
            >
              지문만 보기
            </button>
            <div className={styles.Jimoon}>
              <p>
                순대국밥은 한국에서 사랑받는 전통 음식이에요. 따뜻한 국물과 함께
                밥을 먹는 요리로, 주로 순대와 돼지고기가 들어 있어요. 순대는
                찹쌀과 야채를 돼지 창자에 넣어 만든 음식이랍니다.
              </p>
              <p>
                {" "}
                순대국밥은 추운 날씨에 먹으면 몸을 따뜻하게 해 줘요. 국물은
                진하고 깊은 맛이 나고, 다양한 재료들이 함께 어우러져서
                맛있답니다. 사람들이 각자 입맛에 맞게 소금이나 새우젓을 더 넣어
                먹을 수도 있어요.{" "}
              </p>
              <p>
                이 음식은 한국의 여러 식당에서 쉽게 찾아볼 수 있고, 특히
                아침이나 점심으로 많이 먹는답니다. 든든하고 영양가가 높은
                순대국밥, 기회가 되면 꼭 한번 맛보세요!
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
            <div className={styles.Jimoon}>
              <p>
                순대국밥은 한국에서 사랑받는 전통 음식이에요. 따뜻한 국물과 함께
                밥을 먹는 요리로, 주로 순대와 돼지고기가 들어 있어요. 순대는
                찹쌀과 야채를 돼지 창자에 넣어 만든 음식이랍니다.
              </p>
              <p>
                {" "}
                순대국밥은 추운 날씨에 먹으면 몸을 따뜻하게 해 줘요. 국물은
                진하고 깊은 맛이 나고, 다양한 재료들이 함께 어우러져서
                맛있답니다. 사람들이 각자 입맛에 맞게 소금이나 새우젓을 더 넣어
                먹을 수도 있어요.{" "}
              </p>
              <p>
                이 음식은 한국의 여러 식당에서 쉽게 찾아볼 수 있고, 특히
                아침이나 점심으로 많이 먹는답니다. 든든하고 영양가가 높은
                순대국밥, 기회가 되면 꼭 한번 맛보세요!
              </p>
            </div>
          </div>
        )}

        <div className={styles.questions}>
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

      {/* 팝업창 */}
      {showPopup && (
        <div className={styles.popup}>
          <p>정말 제출하시겠습니까?</p>
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
