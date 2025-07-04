import React, { useEffect, useState } from "react";
import axios from "axios";

const AddUser = ({ currentUser, onUserAdded }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(res => {
        // exclude current user
        const others = res.data.filter(user => user._id !== currentUser._id);
        setUsers(others);
      });
  }, [currentUser]);

  const handleAdd = (userToAdd) => {
    const recent = JSON.parse(localStorage.getItem("chat_users")) || [];
    if (!recent.find(u => u._id === userToAdd._id)) {
      recent.push(userToAdd);
      localStorage.setItem("chat_users", JSON.stringify(recent));
    }
    localStorage.setItem("current_chat", userToAdd._id);
    onUserAdded(userToAdd); // open chat window
  };

  return (
    <div className="add-user-list">
      <h3>Add User to Chat</h3>
      {users.map(u => (
        <div key={u._id} className="add-user-item">
          <img src={u.avatar} alt="dp" className="avatar" />
          <span>{u.name || u.phone}</span>
          <button onClick={() => handleAdd(u)}>Add</button>
        </div>
      ))}
    </div>
  );
};

export default AddUser;
