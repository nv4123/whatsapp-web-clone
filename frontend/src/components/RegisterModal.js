import React, { useState } from "react";
import axios from "axios";

const RegisterModal = ({ showLogin }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        phone,
        password,
      });
      alert("Registered! Now login.");
      showLogin();
    } catch (err) {
      alert("Phone already registered");
    }
  };

  return (
    <div className="modal">
      <h3>Register</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button onClick={register}>Register</button>
    </div>
  );
};

export default RegisterModal;
