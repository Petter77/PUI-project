import { useNavigate } from 'react-router-dom';
import { Home, CookingPot, Heart, User } from 'lucide-react';

const SideBar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <aside className="bg-white text-black w-64 py-6 shadow-md min-h-screen">
    <div className="sticky top-5 flex flex-col space-y-4">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-100 hover:text-blue-500 transition"
      >
        <Home size={24} />
        <span className="text-sm">Home</span>
      </button>
  
      {user && (
        <>
          <button
            onClick={() => navigate('/my-recipes')}
            className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-100 hover:text-blue-500 transition"
          >
            <CookingPot size={24} />
            <span className="text-sm">My Recipes</span>
          </button>
          <button
            onClick={() => navigate('/my-meal-plans')}
            className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-100 hover:text-blue-500 transition"
          >
            <Heart size={24} />
            <span className="text-sm">Meal Plans</span>
          </button>
          <button
            onClick={() => navigate('/user-profile')}
            className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-100 hover:text-blue-500 transition"
          >
            <User size={24} />
            <span className="text-sm">Profile</span>
          </button>
        </>
      )}
    </div>
  </aside>
  
  );
};

export default SideBar;
