import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Select from "./Select";
import Question from "./Question";
import Solution from "./Solution";
import MyPage from "./MyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/select" element={<Select />} />
        <Route path="/question" element={<Question />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
