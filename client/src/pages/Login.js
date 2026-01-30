import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { socket } from "../socket";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userData = {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      uid: user.uid,
    };

    socket.emit("register_user", userData.email);

    await fetch("http://localhost:5005/save-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    // After login go to chat page
    navigate("/chat");
  };

  return (
    <div className="login">
      <h1>Welcome to ChatMe</h1>
      <button onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
}

export default Login;