import React from "react";
import { ScrollAnimation } from "@lasbe/react-scroll-animation";
import styles from "./Section2.module.css";
import img from "./assets/section2.png";

const Section2 = () => {
  return (
    <section id="section2" className={styles.sectionContainer}>
      <ScrollAnimation animation="fadeIn">
        <img src={img} alt="Section 2" className={styles.sectionImage} />
      </ScrollAnimation>
    </section>
  );
};

export default Section2;
