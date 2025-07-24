import React, { useState, useEffect } from "react";
import styles from "./Section1.module.css";
import img1 from "./assets/img1.png";
import img2 from "./assets/img2.png";
import img3 from "./assets/img3.png";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ScrollAnimation } from "@lasbe/react-scroll-animation";

const images = [img1, img2, img3];
const totalSteps = images.length;

const Section1 = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextStep();
    }, 5500);

    return () => clearInterval(interval);
  }, [step]);

  const handleNextStep = () => {
    setStep((prevStep) => (prevStep + 1) % totalSteps);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => (prevStep - 1 + totalSteps) % totalSteps);
  };

  return (
    <ScrollAnimation
      animateIn="fadeInUp"
      animateOnce={false}
      duration={1.5}
      initiallyVisible={false}
    >
      <section id="section1" className={styles.sectionContainer}>
        <img
          src={images[step]}
          alt={`Step ${step + 1} Image`}
          className={styles.sectionImage}
        />

        <div className={styles.bottomNavButtons}>
          <button className={styles.navButton} onClick={handlePrevStep}>
            <FiChevronLeft size={20} />
          </button>
          <button className={styles.navButton} onClick={handleNextStep}>
            <FiChevronRight size={20} />
          </button>
        </div>
      </section>
    </ScrollAnimation>
  );
};

export default Section1;
