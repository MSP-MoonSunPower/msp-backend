import React from "react";
import styles from "./Section2.module.css";
import img4 from "./assets/img4.png";
import img5 from "./assets/img5.png";
import { ScrollAnimation } from "@lasbe/react-scroll-animation";

const Section2 = () => {
  return (
    <section id="section2" className={styles.sectionContainer}>
      <ScrollAnimation
        startingPoint="left"
        duration={1.3}
        amount="lg"
        delay={0}
        animateOnce={true}
      >
        <img src={img4} alt="img4" className={styles.sectionImage} />
      </ScrollAnimation>

      <ScrollAnimation
        startingPoint="left"
        duration={1.3}
        amount="lg"
        delay={1}
        animateOnce={true}
      >
        <img src={img5} alt="img5" className={styles.sectionImage} />
      </ScrollAnimation>
    </section>
  );
};

export default Section2;
