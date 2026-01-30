import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>💬 ChatMe</h1>
      <p>Chat in style. Connect in vibe.</p>
      <button onClick={() => navigate("/login")}>
        Get Started
      </button>
    </div>
  );
}

export default Landing;