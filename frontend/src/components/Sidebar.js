import React, { useState, useEffect } from "react";
import axios from "axios";

const Sidebar = ({ user }) => {
  const [users, setUsers] = useState([]); // list of added users (chats)
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chat_users")) || [];
const filtered = saved.filter((u) => u._id !== user._id);
setUsers(filtered);

  }, []);
 
  const handleSearch = async () => {
    if (!user || !user._id) {
      alert("Please log in first.");
      window.location.href = "/login"; // or use useNavigate()
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/auth/users");
      const found = res.data.filter(
        (u) => u._id !== user._id && u.phone.includes(search)
      );
      setSearchResults(found);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const addUserToChat = (u) => {
    const exists = users.find((item) => item._id === u._id);
    if (!exists) {
      const updated = [u, ...users];
      setUsers(updated);
      localStorage.setItem("chat_users", JSON.stringify(updated));
    }
    localStorage.setItem("current_chat", u._id); // auto open chat
    setSearch("");
    setSearchResults([]);
    window.location.reload(); // reload to refresh chat window if needed
  };

  const handleChatSelect = (id) => {
    setSelectedUserId(id);
    localStorage.setItem("current_chat", id);
    window.location.reload(); // open selected chat
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <input
          placeholder="Search by phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>➕</button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((u) => (
            <div
              key={u._id}
              className="search-user"
              onClick={() => addUserToChat(u)}
            >
              <img src={u.avatar} alt="user" className="avatar" />
              <span>{u.name || u.phone}</span>
            </div>
          ))}
        </div>
      )}

      <div className="chat-list">
        {users.map((u) => (
          <div
            key={u._id}
            className={`chat-item ${selectedUserId === u._id ? "active" : ""}`}
            onClick={() => handleChatSelect(u._id)}
          >
            <img src={u.avatar} alt="avatar" className="avatar" />
            <div>
              <div className="user-name">{u.name || u.phone}</div>
              <div className="last-msg">Last message preview</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
