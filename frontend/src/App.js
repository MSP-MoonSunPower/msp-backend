import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./routes/Home";
import Login from "./routes/Login";
import MyPage from "./routes/MyPage";
import Question from "./routes/Question";
import Select from "./routes/Select";
import Solution from "./routes/Solution";
import AboutUs from "./routes/AboutUs";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Header isHomePage={isHomePage} />
      <main style={{ marginTop: isHomePage ? "0px" : "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/question" element={<Question />} />
          <Route path="/select" element={<Select />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/AboutUs" element={<AboutUs />} />
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
