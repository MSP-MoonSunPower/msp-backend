import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import LoginModal from "./LoginModal";
import yellowLogo from "../assets/logoYellow.png";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const authToken = localStorage.getItem("authToken"); // authtoken 확인

    console.log("초기 로드 시 저장된 토큰:", authToken);

    if (loggedInStatus && authToken) {
      setIsLoggedIn(true);
      fetchProfile(authToken);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const trimmedToken = token.trim();
      console.log("Authorization 헤더에 들어가는 토큰:", trimmedToken);
      const headers = {
        Authorization: `Token ${trimmedToken}`,
        "Content-Type": "application/json",
      };

      console.log("보낼 헤더:", headers);
      const response = await fetch("https://moonsunpower.com/user/profile/", {
        method: "GET",
        headers: {
          headers,
          Authorization: `Token ${trimmedToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("프로필 정보를 불러오지 못했습니다.");

      const profileData = await response.json();
      console.log("사용자 프로필 불러오기 성공:", profileData);

      if (profileData.profile_image_url) {
        const absoluteImageUrl = profileData.profile_image_url.startsWith("/")
          ? `https://moonsunpower.com${profileData.profile_image_url}`
          : profileData.profile_image_url;

        setProfileImage(absoluteImageUrl);
        localStorage.setItem("profile_image", absoluteImageUrl);
      } else {
        console.warn("profile_image 없음. 응답 데이터 확인:", profileData);
      }

      if (profileData.nickname) {
        setNickname(profileData.nickname);
        localStorage.setItem("nickname", profileData.nickname);
      } else {
        console.warn("nickname 없음. 응답 데이터 확인:", profileData);
      }
      console.log(profileData.profile_image_url);
    } catch (err) {
      console.error("사용자 프로필 불러오기 실패:", err);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfileImage("");
    setNickname("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("profile_image");
    localStorage.removeItem("nickname");
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleLogin = (userData) => {
    console.log("로그인 성공! 응답 데이터:", userData); // 로그인 후 authToken이 정상적으로 저장되는지 확인

    if (!userData) {
      console.error("토큰이 존재하지 않음! userData:", userData);
      return; // 토큰이 없으면 저장하지 않음
    }

    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("authToken", userData); // userData를 저장 - 백엔드에서 로그인 API 응답을 토큰 문자열 자체로 반환하고 있기 때문
    console.log(
      "토큰 저장 완료! 저장된 값:",
      localStorage.getItem("authToken")
    );

    fetchProfile(userData);
    setIsModalOpen(false);
  };

  const handleLogoClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <header
      className={`${styles.header} ${isHomePage ? styles.homeHeader : ""}`}
    >
      <div className={styles.logoContainer} onClick={handleLogoClick}>
        <span className={styles.title}>MoonSunPower</span>
      </div>
      <nav className={styles.nav}>
        <Link to="/mypage" className={styles.navLink}>
          My Page
        </Link>
        <Link to="/aboutus" className={styles.navLink}>
          About Us
        </Link>

        {isLoggedIn ? (
          <div className={styles.profileSection}>
            <button onClick={handleLogout} className={styles.logoutLink}>
              Log out
            </button>
            <span className={styles.nickname}>{nickname || "사용자 "} 님</span>
            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필"
                className={styles.profileImage}
                onError={(e) => {
                  console.error("프로필 이미지 로드 실패:", profileImage);
                  e.target.src = "/default-profile.png";
                }}
              />
            ) : (
              <img
                src="/default-profile.png"
                alt="기본 프로필"
                className={styles.profileImage}
              />
            )}
          </div>
        ) : (
          <button onClick={handleModalOpen} className={styles.navLink}>
            Login
          </button>
        )}
      </nav>

      {isModalOpen && (
        <LoginModal onClose={handleModalClose} onLogin={handleLogin} />
      )}
    </header>
  );
}

export default Header;
