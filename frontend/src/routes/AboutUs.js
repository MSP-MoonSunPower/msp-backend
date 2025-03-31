import React from "react";
import styles from "./AboutUs.module.css";
import sj from "../assets/sj1.jpg";
import hwan from "../assets/hwan1.jpg";
import sm from "../assets/sm1.jpg";
import sb from "../assets/sebin1.jpg";
import yj from "../assets/yj1.jpg";

function AboutUs() {
  const teamSections = [
    {
      title: "프롬프트 짜는 사람들",
      members: [
        {
          id: 1,
          name: "나윤재",
          description: "팀장이자 박명수",
          introduction: "서강고 3학년",
          tagline: "다섯달째 프롬프트 무한굴레. / 달리기 장인",
          image: yj,
        },
        {
          id: 2,
          name: "오승민",
          description: "PM",
          introduction: "서강고 3학년",
          tagline: "깃린이 (언제 rm -rf 할지 몰라서 개무서움)",
          image: sm,
        },
      ],
    },
    {
      title: "일할게..",
      members: [
        {
          id: 3,
          name: "최완",
          description: "백엔드 개발자",
          introduction: "서강고 4학년",
          tagline: "독재의 맛 느끼다 탄핵된지 한달차",
          image: hwan,
        },
        {
          id: 4,
          name: "안서진",
          description: "프론트 개발자",
          introduction: "서강고 4학년 (5학년 예정)",
          tagline: "일많다고 징징대놓고 만우절 이벤트 할 생각에 제일 신남",
          image: sj,
        },
      ],
    },

    {
      title: "실세",
      members: [
        {
          id: 5,
          name: "황세빈",
          description: "서강고 4학년",
          introduction: "서강대학교 유럽문화학과 & 경영학과 21",
          tagline: "서진언니가 하면 해 ",
          image: sb,
        },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>MSP 식구들</h1>

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
