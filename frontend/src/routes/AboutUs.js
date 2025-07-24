import React from "react";
import styles from "./AboutUs.module.css";
import sj from "../assets/sj.jpg";
import hwan from "../assets/hwan.jpg";
import sm from "../assets/seungmin.png";
import sb from "../assets/sebin.jpg";
import yj from "../assets/yj.jpg";

function AboutUs() {
  const teamSections = [
    {
      title: "Development",
      members: [
        {
          id: 1,
          name: "Hwan Choe",
          description: "Backend Developer",
          introduction: "서강대학교 유럽문화학과 & 컴퓨터공학과 19",
          tagline: "inifity and beyond",
          image: hwan,
        },
        {
          id: 2,
          name: "Seojin An",
          description: "Frontend Engineer / UXUI Designer ",
          introduction: "서강대학교 유럽문화학과 & 컴퓨터공학과 20",
          tagline: "Always be curious. Carpe diem!",
          image: sj,
        },
      ],
    },
    {
      title: "Prompt Engineering",
      members: [
        {
          id: 3,
          name: "Yunje Na",
          description: "Team Leader / Prompt Engineer",
          introduction: "서강대학교 유럽문화학과 & 경영학과 21",
          tagline: "Do or Die",
          image: yj,
        },
        {
          id: 4,
          name: "Seungmin Oh",
          description: "Prompt Engineer",
          introduction: "서강대학교 유럽문화학과 & 경영학과 21",
          tagline: "Stay hungry, Stay foolish",
          image: sm,
        },
      ],
    },

    {
      title: "Strategic Planning",
      members: [
        {
          id: 5,
          name: "Sebin Hwang",
          description: "Business Development Manager",
          introduction: "서강대학교 유럽문화학과 & 경영학과 21",
          tagline: "The growth of the team is the growth of the individual",
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
