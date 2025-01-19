import React, { useEffect } from "react";
import styles from "./Solution.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Solution = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("location.state:", location.state);
  }, [location]);

  const {
    passage = "",
    questions = [],
    selectedAnswers = [],
    elapsedTime = "",
    vocabulary = [],
    wordDefinitions = [],
  } = location.state || {};

  const modifiedVocabulary = vocabulary.map((word) => {
    const definitionObj = wordDefinitions.find((item) => {
      if (!item || !item.word) return false; // item이 undefined인 경우 처리
      const normalizedWord = word.trim().toLowerCase();
      const normalizedDefinitionWord = item.word.trim().toLowerCase();
      return normalizedWord === normalizedDefinitionWord;
    });

    const meaning = definitionObj
      ? definitionObj.definition
      : "단어의 정의를 찾을 수 없습니다.";
    return { word, meaning };
  });

  useEffect(() => {
    console.log("modifiedVocabulary 배열:", modifiedVocabulary);
  }, [modifiedVocabulary]);

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
                          selectedAnswers[index] === choiceIndex + 1
                            ? isCorrect
                              ? styles.correctSelected
                              : styles.incorrectSelected
                            : ""
                        } ${
                          choiceIndex + 1 === item.answer
                            ? styles.correctChoice
                            : ""
                        }`}
                      >
                        {choiceIndex + 1}. {choice}
                      </div>
                    ))}
                  </div>
                  <div className={styles.explanation}>
                    {isCorrect
                      ? "정답입니다!"
                      : `틀렸습니다! 정답 : ${item.answer}번 `}
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
          <h2 className={styles.wordListtitle}>단어장</h2>
          {modifiedVocabulary.length > 0 ? (
            <ol className={styles.wordList}>
              {modifiedVocabulary.map((wordDef, index) => (
                <li key={index} className={styles.wordItem}>
                  <strong className={styles.word}>{wordDef.word}</strong>:{" "}
                  {wordDef.meaning}
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.noWordsMessage}>선택한 단어가 없습니다</p>
          )}
        </div>
      </div>

      <Link to="/select">
        <button className={styles.startButton}>주제 선택으로 돌아가기</button>
      </Link>
    </div>
  );
};

export default Solution;
