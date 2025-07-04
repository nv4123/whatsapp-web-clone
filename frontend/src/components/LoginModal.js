import React, { useState } from "react";
import axios from "axios";

const LoginModal = ({ setUser, showRegister }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone,
        password,
      });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="modal">
      <h3>Login</h3>
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <p onClick={showRegister}>New user? Register here</p>
    </div>
  );
};

export default LoginModal;
