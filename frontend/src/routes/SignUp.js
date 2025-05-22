import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./SignUp.module.css";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    nickname: "",
    birth_date: "",
    profile_image: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profile_image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleConfirmSignUp = async () => {
    setShowModal(false);
    setError("");
    setSuccess("");

    // 유효성 검사
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(formData.username)) {
      alert("아이디는 영어 및 숫자로 이루어진 4~20자여야 합니다.");
      return;
    }

    if (!formData.password.trim()) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert(
        "비밀번호는 영어, 숫자, 특수문자를 포함하고 8자리 이상이어야 합니다."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.nickname.length < 3) {
      alert("닉네임은 3글자 이상이어야 합니다.");
      return;
    }

    const birthDate = formData.birth_date ? formData.birth_date : "2000-01-01";

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("nickname", formData.nickname);
    formDataToSend.append("birth_date", birthDate);
    formDataToSend.append("name", formData.name);
    if (formData.profile_image) {
      formDataToSend.append("profile_image", formData.profile_image);
    }

    try {
      const response = await fetch("https://moonsunpower.com/user/signup/", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        setSuccess("회원가입이 완료되었습니다!");

        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        if (data.nickname) {
          localStorage.setItem("nickname", data.nickname);
        }
        if (data.profile_image) {
          localStorage.setItem("profile_image", data.profile_image);
        }

        navigate("/");
      } else {
        alert(data.detail || "회원가입 실패");
      }
    } catch (err) {
      alert("서버 요청 중 오류가 발생했습니다.");
      console.error("회원가입 API 오류:", err);
    }
  };

  return (
    <div>
      <h2 className={styles.SignUp}>회원가입</h2>
      <div className={styles.signupContainer}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <div className={styles.profileContainer}>
          {/* 동그라미 회색 박스(기본 프로필) 클릭 시 파일 선택 가능 */}
          <label htmlFor="profile_image" className={styles.profileImageWrapper}>
            {previewImage ? (
              <img
                src={previewImage}
                alt="프로필 미리보기"
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profilePlaceholder}></div>
            )}
          </label>
          <label htmlFor="profile_image" className={styles.labelStyle}>
            프로필 이미지 등록하기
          </label>

          <input
            type="file"
            id="profile_image"
            name="profile_image"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className={styles.signupForm}
        >
          <div className={styles.formGroup}>
            <label htmlFor="username">아이디 *</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="아이디를 입력하세요. (영어 및 숫자 4~20자)"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">비밀번호 *</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요. (영어,숫자,특수문자 모두 포함) "
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">비밀번호 확인 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요."
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">이름 *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="이름을 입력하세요."
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nickname">닉네임 *</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="닉네임을 입력하세요. (3글자 이상)"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">이메일 *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="이메일을 입력하세요."
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="birth_date">생년월일</label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </div>
          <button
            type="button"
            className={styles.submitButton}
            onClick={() => setShowModal(true)}
          >
            회원가입
          </button>
        </form>

        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>개인정보 이용 동의</h3>
              <div className={styles.modalBody}>
                <p>
                  본 서비스 MoonSunPower(이하 : MSP)는 귀하의 개인정보를
                  보호하고 안전하게 관리하기 위해 최선을 다하고 있습니다. 본
                  동의서는 MSP에서 제공하는 서비스를 이용하기 위해 필요한
                  개인정보의 수집 및 이용에 동의함을 확인힙니다.
                </p>
                <p>
                  <strong>제 1조 [목적]</strong> <br />본 동의서는 MSP 제반
                  서비스의 회원 관리, 구독 서비스 제공, 서비스 개발 및 개선의
                  목적으로만 개인정보를 이용합니다. <br />- 회원 가입 의사의
                  확인, 연령 확인 및 법정대리인 동의 진행, 이용자 및
                  법정대리인의 본인 확인, 이용자 식별, 회원탈퇴 의사의 확인 등
                  회원관리를 위하여 개인정보를 이용합니다. <br />- 컨텐츠 등
                  기존 서비스 제공(광고 포함), 서비스 이용기록과 접속 빈도 분석,
                  서비스 이용에 대한 통계, 서비스 분석 및 통계에 따른 맞춤
                  서비스 제공 및 광고 게재 등에 개인정보를 이용합니다. <br />-
                  컨텐츠 생성·제공 등에서의 인공지능(AI) 기술 적용이 포함됩니다.{" "}
                  <br />- 유료 서비스 제공에 따르는 본인인증, 구매 및 요금 결제,
                  상품 및 서비스의 배송을 위하여 개인정보를 이용합니다. <br />-
                  이벤트 정보 및 참여기회 제공, 광고성 정보 제공 등 마케팅 및
                  프로모션 목적으로 개인정보를 이용합니다.
                  <br />
                  <br /> <strong>제 2조 [수집정보 내역]</strong> <br />
                  이용자는 회원가입을 하지 않아도 오늘의 지문, 초중고급
                  문제풀이와 같은 핵심 서비스를 회원과 동일하게 이용할 수
                  있습니다. 이용자가 오답노트, 친구맺기와 같이 개인화 혹은
                  회원제 서비스를 이용하기 위해 회원가입을 할 경우, 네이버는
                  서비스 이용을 위해 필요한 최소한의 개인정보를 수집합니다.{" "}
                  <br />
                  <br />
                  회원가입 시점에 MSP가 이용장로부터 수집하는 개인정보는 아래와
                  같습니다. <br />- 회원 가입 시 필수항목으로 아이디, 비밀번호,
                  이름과 성별을, 선택항목으로 생년월일을 수집합니다.
                  <br />
                  <br /> <strong>제 3조 [보유 및 이용 기간] </strong>
                  <br />
                  MSP는 원칙적으로 이용자의 개인정보를 회원 탈퇴 시 지체없이
                  파기하고 있습니다. 전자상거래 등에서의 소비자 보호에 관한
                  법률, 전자문서 및 전자거래 기본법, 통신비밀보호법 등 법령에서
                  일정기간 정보의 보관을 규정하는 경우는 아래와 같습니다. MSP는
                  이 기간 동안 법령의 규정에 따라 개인정보를 보관하며, 본 정보를
                  다른 목적으로는 절대 이용하지 않습니다.
                  <br />
                  <br /> - 전자상거래 등에서 소비자 보호에 관한 법률 계약 또는
                  청약철회 등에 관한 기록: 5년 보관 <br />
                  대금결제 및 재화 등의 공급에 관한 기록: 5년 보관 <br />
                  소비자의 불만 또는 분쟁처리에 관한 기록: 3년 보관
                  <br /> - 전자문서 및 전자거래 기본법 공인전자주소를 통한
                  전자문서 유통에 관한 기록 : 10년 보관 <br />- 통신비밀보호법
                  로그인 기록: 3개월 <br />
                  <br />
                  <strong>
                    제 4조 [개인정보 수집 및 이용 동의를 거부할 권리]{" "}
                  </strong>
                  <br />
                  개인정보 수집 및 이용 동의를 거부할 권리 이용자는 개인정보의
                  수집 및 이용 동의를 거부할 권리가 있습니다. 회원가입 시
                  수집하는 최소한의 개인정보, 즉, 필수 항목에 대한 수집 및 이용
                  동의를 거부하실 경우, 회원가입이 어려울 수 있습니다.
                  <br />
                  <br />
                  <strong>위와 같이 개인정보를 수집·이용합니다.</strong>
                </p>
              </div>
              <div className={styles.modalFooter}>
                <button onClick={handleConfirmSignUp}>동의하고 회원가입</button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  뒤로가기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
