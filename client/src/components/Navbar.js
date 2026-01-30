import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%",
      padding: "15px 30px",
      borderRadius: "40px",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      display: "flex",
      justifyContent: "space-between",
      color: "white",
      zIndex: 100
    }}>
      <div style={{ cursor: "pointer" }} onClick={() => navigate("/chat")}>
        💬 ChatMe
      </div>

      <div>
        <span style={{ marginRight: "20px", cursor: "pointer" }} onClick={() => navigate("/chat")}>
          Chat
        </span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
          Profile
        </span>
      </div>
    </div>
  );
}

export default Navbar;