import React from "react";
import styles from "./Solution.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Solution = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    passage = "",
    questions = [],
    selectedAnswers = [],
    elapsedTime = "",
    vocabulary = [],
    wordDefinitions = [],
  } = location.state || {};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>문제 확인 (소요 시간: {elapsedTime})</h2>
      </div>
      <div className={styles.passage}>{passage}</div>
      <div className={styles.splitContainer}>
        <div className={styles.answers}>
          <ol className={styles.questionList}>
            {questions.map((item, index) => {
              const isCorrect = selectedAnswers[index] === item.answer;
              return (
                <li key={index} className={styles.questionItem}>
                  <p>
                    <strong>#{index + 1}</strong> {item.question_text}
                  </p>
                  <div className={styles.choices}>
                    {[
                      item.choice1,
                      item.choice2,
                      item.choice3,
                      item.choice4,
                      item.choice5,
                    ].map((choice, choiceIndex) => (
                      <div
                        key={choiceIndex}
                        className={`${styles.choice} ${
                          choiceIndex + 1 === item.answer
                            ? styles.correctChoice
                            : ""
                        } ${
                          selectedAnswers[index] === choiceIndex + 1 &&
                          selectedAnswers[index] !== item.answer
                            ? styles.selectedChoice
                            : ""
                        }`}
                      >
                        {choiceIndex + 1}. {choice}
                      </div>
                    ))}
                  </div>
                  <div className={styles.explanation}>
                    {isCorrect ? "정답입니다!" : `정답: ${item.answer}번`}
                    {item.explanation && (
                      <p className={styles.explanationText}>
                        해설: {item.explanation}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className={styles.vocabulary}>
          <h2>단어장</h2>
          <ol className={styles.wordList}>
            {wordDefinitions.length > 0 ? (
              wordDefinitions.map((wordDef, index) => (
                <li key={index} className={styles.wordItem}>
                  <strong>{wordDef.word}</strong>: {wordDef.definition}
                </li>
              ))
            ) : (
              <p>모르는 단어가 없습니다.</p>
            )}
          </ol>
        </div>
      </div>

      <Link to="/select">
        <button className={styles.startButton}>주제 선택으로 돌아가기</button>
      </Link>
    </div>
  );
};

export default Solution;
