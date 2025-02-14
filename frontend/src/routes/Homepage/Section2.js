import React from "react";
import styles from "./Section2.module.css";
import img4 from "./assets/img4.png";
import img5 from "./assets/img5.png";
import { ScrollAnimation } from "@lasbe/react-scroll-animation";

const Section2 = () => {
  return (
    <section id="section3" className={styles.sectionContainer}>
      {/* 첫 번째 이미지 - 왼쪽에서 등장 */}
      <ScrollAnimation
        startingPoint="left"
        duration={1.3}
        amount="lg"
        delay={0}
        animateOnce={true}
      >
        <img src={img4} alt="img4" className={styles.sectionImage} />
      </ScrollAnimation>

      {/* 두 번째 이미지 - 첫 번째가 거의 다 나오고 바로 등장 */}
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
