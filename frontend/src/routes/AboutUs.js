import React from "react";
import styles from "./AboutUs.module.css";
import sj from "../sj.png";
import hwan from "../hwan.png";
import sm from "../seungmin.png";
import sb from "../sebin.jpg";
import yj from "../yj.jpg";

function AboutUs() {
  const teamSections = [
    {
      title: "개발팀",
      members: [
        {
          id: 1,
          name: "최환",
          description: "PM & Backend Engineer",
          introduction: "서강대학교 유럽문화학과 & 컴퓨터공학과 19",
          tagline: "행복은 결과가 아니라 과정에서 발견된다.",
          image: hwan,
        },
        {
          id: 2,
          name: "안서진",
          description: "Designer & Frontend Engineer",
          introduction: "서강대학교 유럽문화학과 & 컴퓨터공학과 20",
          tagline: "네가 할 수 있다고 믿든, 할 수 없다고 믿든, 둘 다 맞다.",
          image: sj,
        },
      ],
    },
    {
      title: "프롬프트 엔지니어링",
      members: [
        {
          id: 3,
          name: "오승민",
          description: "Prompt Engineer ",
          introduction: "서강대학교 유럽문화학과 & 경영학과 21",
          tagline: "변화는 고통스럽다. 하지만 후회는 더 고통스럽다.",
          image: sm,
        },
        {
          id: 4,
          name: "나윤재",
          description: "Prompt Engineer",
          introduction: "서강대학교 유럽문화학과 & 경영학과 21",
          tagline:
            "성공은 넘어지는 횟수가 아니라, 다시 일어나는 횟수로 결정된다.",
          image: yj,
        },
      ],
    },
    {
      title: "재무/전략",
      members: [
        {
          id: 5,
          name: "황세빈",
          description: "재무",
          introduction: "서강대학교 유럽문화학과 & 경영학과 21",
          tagline: "미래를 예측하는 가장 좋은 방법은 그것을 만드는 것이다.",
          image: sb,
        },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Team MSP</h1>

      {teamSections.map((section) => (
        <div key={section.title} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <div className={styles.teamContainer}>
            {section.members.map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <img
                  src={member.image}
                  alt={`${member.name} image`}
                  className={styles.memberImage}
                />
                <div className={styles.textContainer}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberIntroduction}>
                    {member.introduction}
                  </p>
                  <p className={styles.memberDescription}>
                    {member.description}
                  </p>
                  <p className={styles.memberTagline}>{member.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AboutUs;
