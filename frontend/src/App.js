// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import MyPage from "./routes/MyPage";
import Question from "./routes/Question";
import Select from "./routes/Select";
import Solution from "./routes/Solution";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/question" element={<Question />} />
        <Route path="/select" element={<Select />} />
        <Route path="/solution" element={<Solution />} />
      </Routes>
    </Router>
  );
}

export default App;
