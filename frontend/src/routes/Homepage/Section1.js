import React, { useState, useEffect } from "react";
import styles from "./Section1.module.css";
import img1 from "./assets/img1.png";
import img2 from "./assets/img2.png";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ScrollAnimation } from "@lasbe/react-scroll-animation";

const images = [img1, img2];
const totalSteps = images.length;

const Section1 = () => {
  const [step, setStep] = useState(0);
  const [slideKey, setSlideKey] = useState(0); // 애니메이션 트리거 키

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextStep();
    }, 2000);

    return () => clearInterval(interval);
  }, [step]);

  // 애니메이션 리렌더링
  const handleNextStep = () => {
    setStep((prevStep) => (prevStep + 1) % totalSteps);
    setSlideKey((prevKey) => prevKey + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => (prevStep - 1 + totalSteps) % totalSteps);
    setSlideKey((prevKey) => prevKey + 1);
  };

  return (
    <ScrollAnimation>
      <div className={styles.wrapper}>
        <section id="section1" className={styles.sectionContainer}>
          <div
            key={slideKey}
            className={`${styles.imageContainer} ${styles["slide-in-right"]}`}
          >
            <img
              src={images[step]}
              alt={`Step ${step + 1} Image`}
              className={styles.sectionImage}
            />
          </div>

          <div className={styles.bottomNavButtons}>
            <button className={styles.navButton} onClick={handlePrevStep}>
              <FiChevronLeft size={20} />
            </button>
            <button className={styles.navButton} onClick={handleNextStep}>
              <FiChevronRight size={20} />
            </button>
          </div>
        </section>
      </div>
    </ScrollAnimation>
  );
};

export default Section1;
