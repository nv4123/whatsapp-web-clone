import React from "react";

const Navbar = ({ user, onLogout, onLoginClick }) => {
  return (
    <div className="navbar">
      <h2>WhatsApp Web Clone</h2>
      {user ? (
        <div className="user-info">
          <img src={user.avatar} alt="profile" className="avatar" />
          <span>{user.name || user.phone}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={onLoginClick}>Login / Signup</button>
      )}
    </div>
  );
};

export default Navbar;
