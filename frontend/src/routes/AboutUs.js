import React from "react";
import styles from "./AboutUs.module.css";
import logo from "../logo.jpg";
import sj from "../sj.png";
import hwan from "../hwan.png";
import sm from "../seungmin.png";
import sb from "../sebin.jpg";
import yj from "../yj.jpg";

function AboutUs() {
  const teamMembers = [
    {
      id: 1,
      name: "최후안",
      description: "PM & Backend Developer",
      introduction: "유문 & 컴공 19",
      tagline: (
        <>
          대한민국 예비역 병장 <br />
          햄최5
        </>
      ),
      image: hwan,
    },
    {
      id: 2,
      name: "안서진",
      description: "Designer & Frontend Developer",
      introduction: "유문 & 컴공 20",
      tagline: (
        <>
          대한민국 예비역 대위 <br />
          중대 비상
        </>
      ),
      image: sj,
    },
    {
      id: 3,
      name: "나윤재",
      description: "Prompt Engineer",
      introduction: "유문 & 경영 21",
      tagline: (
        <>
          대한민국 예비역 병장
          <br />
          무도liebemann
        </>
      ),
      image: yj,
    },
    {
      id: 4,
      name: "오승민",
      description: "Prompt Engineer",
      introduction: "유문 & 경영 21",
      tagline: (
        <>
          대한민국 예비역 병장 <br />
          아침 9시 회의의 주범
        </>
      ),
      image: sm,
    },
    {
      id: 5,
      name: "황세빈",
      description: "Designer",
      introduction: "유문 & 경영 21",
      tagline: (
        <>
          미필 <br />
          #mood #당근과 #채찍
        </>
      ),
      image: sb,
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🙋‍♂️ MSP를 만든 사람들 🙋</h1>
      <p className={styles.ment}>
        서강대학교 유럽문화학과 학생 5명이 캡스톤 디자인을 위해 모인 팀.
        <br />
        처음부터 이렇게 열심히 할 줄은 몰랐으나, 하다보니 애정이 생겨 잠
        줄여가고 눈물 흘리며 만들었습니다. <br />
        저희의 노고를 절대 절대 잊지 말아주세요. 🥰
      </p>
      <div className={styles.teamContainer}>
        {teamMembers.map((member) => (
          <div key={member.id} className={styles.memberCard}>
            <img
              src={member.image}
              alt={`${member.name} image`}
              className={styles.memberImage}
            />
            <h3 className={styles.memberName}>{member.name}</h3>
            <p className={styles.memberIntroduction}>{member.introduction}</p>
            <p className={styles.memberDescription}>{member.description}</p>

            <p className={styles.memberTagline}>{member.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
