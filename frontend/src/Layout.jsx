import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";

const Layout = ({ userToken, setUserToken, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">
      <TopBar
        userToken={userToken}
        setUserToken={setUserToken}
        user={user}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex flex-1">
        <SideBar user={user} isOpen={isSidebarOpen} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

