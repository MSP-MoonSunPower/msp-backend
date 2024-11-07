/* mport React from "react";
import styles from "./Solution.module.css";

function Solution() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>솔루션 페이지</h1>
    </div>
  );
}

export default Solution; */

import React, { useState } from "react";

function Solution() {
  const [highlightedTexts, setHighlightedTexts] = useState([]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text && !highlightedTexts.includes(text)) {
      // 중복 방지
      setHighlightedTexts((prevTexts) => [...prevTexts, text]);
      highlightText(selection);
    }
  };

  const highlightText = (selection) => {
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow"; // 하이라이트 색상
    try {
      range.surroundContents(span);
    } catch (e) {
      console.error("하이라이트 중 오류 발생:", e);
    }
    selection.removeAllRanges();
  };

  const removeText = (index) => {
    setHighlightedTexts((prevTexts) => prevTexts.filter((_, i) => i !== index));
  };

  return (
    <div onMouseUp={handleMouseUp}>
      <p>
        "사형은 법죄에 대한 가장 극단적인 처벌로, 법원에 의해 범죄자가 유죄
        판결을 받았을 때 실행되는 형벌입니다. 사형의 역사적 기원은 매우
        오래되었으며..."
      </p>
      {highlightedTexts.length > 0 && (
        <div>
          <h3>저장된 단어들:</h3>
          <ul>
            {highlightedTexts.map((text, index) => (
              <li key={index}>
                {index + 1}. {text}
                <button onClick={() => removeText(index)}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Solution;
