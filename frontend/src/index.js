import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 브라우저 탭 제목 변경
document.title = "Moon Sun Power";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
