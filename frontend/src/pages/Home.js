import React from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const Home = ({ user }) => {
  if (!user) return <div>Please login to continue</div>;

  return (
    <div className="main-container">
      <Sidebar user={user} />
      <ChatWindow user={user} />
    </div>
  );
};

export default Home;
