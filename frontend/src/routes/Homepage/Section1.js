import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Section1.module.css";
import img1 from "./assets/img1.png";
import img2 from "./assets/img2.png";
import { ScrollAnimation } from "@lasbe/react-scroll-animation";

const Section1 = () => {
  return (
    <section id="section1" className={styles.sectionContainer}>
      <ScrollAnimation>
        <img src={img1} alt="img1" className={styles.sectionImage} />
      </ScrollAnimation>

      <ScrollAnimation startingPoint="right">
        <img src={img2} alt="img2" className={styles.sectionImage} />
      </ScrollAnimation>
    </section>
  );
};

export default Section1;
