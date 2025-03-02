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

  const modifiedVocabulary = vocabulary.flatMap((wordString) => {
    // 쉼표와 공백 기준 단어 분리
    const words = wordString
      .split(/[\s,]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    return words.map((word) => {
      // 정확한 매칭 시도
      let definitionObj = wordDefinitions.find(
        (item) => item.word.trim() === word.trim()
      );

      // 정확한 매칭이 없으면 부분 일치로 대체 (예: "문화의" → "문화")
      if (!definitionObj) {
        definitionObj = wordDefinitions.find((item) =>
          word.includes(item.word)
        );
      }

      return {
        word: definitionObj ? definitionObj.word : word, //  API에서 찾은 단어로 변경
        definition: definitionObj ? definitionObj.definition : "정의 없음",
      };
    });
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
                  {wordDef.definition || "정의 없음"}
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
