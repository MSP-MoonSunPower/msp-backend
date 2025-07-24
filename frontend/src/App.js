import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Homepage/Home";
import MyPage from "./routes/MyPage";
import AboutUs from "./routes/AboutUs";
import Question from "./routes/Question";
import Select from "./routes/Select";
import Solution from "./routes/Solution";
import SignUp from "./routes/SignUp";
import "pretendard/dist/web/variable/pretendardvariable.css";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div
        style={{
          fontFamily:
            '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
        }}
      ></div>
      <Header isHomePage={isHomePage} />
      <main style={{ marginTop: isHomePage ? "0px" : "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Mypage" element={<MyPage />} />
          <Route path="/Aboutus" element={<AboutUs />} />
          <Route path="/Question" element={<Question />} />
          <Route path="/Select" element={<Select />} />
          <Route path="/Solution" element={<Solution />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </main>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
