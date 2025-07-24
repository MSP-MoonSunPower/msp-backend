import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyPage.module.css";

function MyPage() {
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    if (!alertShown) {
      setAlertShown(true);
      alert("MyPage는 8월 중에 만나볼 수 있습니다!");
      navigate("/");
    }
  }, [alertShown, navigate]);
}

export default MyPage;
