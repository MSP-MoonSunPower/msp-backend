import React from "react";
import styles from "./AboutUs.module.css";
import sj from "../assets/sj2.png";
import hwan from "../assets/hwan2.png";
import sm from "../assets/seungmin2.png";
import sb from "../assets/sebin2.png";
import yj from "../assets/yj2.png";
function AboutUs() {
  const teamSections = [
    {
      title: "2학년 4반 친구들",
      members: [
        {
          id: 1,
          name: "윤재",
          description: "장래희망 : 파일럿",
          tagline: "인생은 짧고 ... 열심히 해라",
          image: yj,
        },
        {
          id: 5,
          name: "세빈공쥬",
          description: " 장래희망 : 권한대행",
          tagline: "매일 아침 아폴로 1팩씩 바친다 실시",
          image: sb,
        },
      ],
    },
    {
      title: "2학년 5반 친구들",
      members: [
        
        {
          id: 2,
          name: "승민",
          description: "장래희망 : 대통령",
          tagline: "2년동안 고생했고 나중에 웃으면서 보자~^^",
          image: sm,
        },
      ],
    },
    {
      title: "2학년 6반 친구들",
      members: [
        {
          id: 3,
          name: "환",
          description: "장래희망: 외교관",
          tagline: "난 롤쟁이니까",
          image: hwan,
        },
        {
          id: 4,
          name: "서진",
          description: "장래희망 : 아이돌",
          tagline: "친구들아~ 항상 고맙구 10년뒤에 꼭 보자!!",
          image: sj,
        },
      ],
    },

    
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>탐라중학교 학생들을 소개합니다~</h1>

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