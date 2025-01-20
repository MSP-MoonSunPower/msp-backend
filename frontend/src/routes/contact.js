import React, { useState } from "react";
import styles from "./contact.module.css";

const Contact = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const addPost = () => {
    if (newPost.trim() !== "") {
      setPosts([...posts, newPost]);
      setNewPost("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>고객의 소리 (칭찬, 오류 제보 등)</h1>
      <div className={styles.inputContainer}></div>
      <ul className={styles.postList}>
        {posts.map((post, index) => (
          <li key={index} className={styles.postItem}>
            <p>{post}</p>
          </li>
        ))}
      </ul>
      <div className={styles.inputContainer}>
        <textarea
          className={styles.textarea}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="MSP를 사용하며 느낀 점을 자유롭게 적어주세요!"
        />
        <button className={styles.addButton} onClick={addPost}>
          확인
        </button>
      </div>
    </div>
  );
};

export default Contact;
