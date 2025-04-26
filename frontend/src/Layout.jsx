import { Outlet } from "react-router-dom";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";

const Layout = ({ userToken, setUserToken, user }) => {
  return (
    <div className="flex min-h-screen bg-[#121216] text-white"> 
      <SideBar user={user}/>
      <div className="flex flex-col flex-grow">
        <TopBar userToken={userToken} setUserToken={setUserToken} user={user} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
