import { useNavigate } from 'react-router-dom';
import { Home, CookingPot, Heart, User } from 'lucide-react';

const SideBar = ({ user }) => {
  const navigate = useNavigate();

  return (
<aside className="bg-[#1a1a1e] text-white w-64 flex flex-col py-6 space-y-4 shadow-md min-h-screen">
<button 
        onClick={() => navigate('/')} 
        className="flex items-center space-x-4 px-4 py-2 hover:bg-[#2a2a2e] hover:text-blue-400 transition"
      >
        <Home size={24} />
        <span className="text-sm">Home</span>
      </button>

      {user && (
        <>
          <button 
            onClick={() => navigate('/my-recipes')} 
            className="flex items-center space-x-4 px-4 py-2 hover:bg-[#2a2a2e] hover:text-blue-400 transition"
          >
            <CookingPot size={24} />
            <span className="text-sm">My Recipes</span>
          </button>
          <button 
            onClick={() => navigate('/my-meal-plans')} 
            className="flex items-center space-x-4 px-4 py-2 hover:bg-[#2a2a2e] hover:text-blue-400 transition"
          >
            <Heart size={24} />
            <span className="text-sm">Meal Plans</span>
          </button>
          <button 
            onClick={() => navigate('/user-profile')} 
            className="flex items-center space-x-4 px-4 py-2 hover:bg-[#2a2a2e] hover:text-blue-400 transition"
          >
            <User size={24} />
            <span className="text-sm">Profile</span>
          </button>
        </>
      )}
    </aside>
  );
};

export default SideBar;
