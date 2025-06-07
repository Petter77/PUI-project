import { useNavigate } from 'react-router-dom';
import { User, UtensilsCrossed, Menu } from 'lucide-react';

const TopBar = ({ userToken, user, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white text-black shadow-md w-full sticky top-0 z-50 px-6 py-4 flex items-center justify-between relative">
      {/* Lewy pasek z przyciskiem menu */}
      <div className="flex items-center space-x-4 min-w-[120px]">
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-200 rounded-lg">
          <Menu size={24} />
        </button>
      </div>

      {/* Logo na środku */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-2xl font-bold tracking-wide">
        <UtensilsCrossed size={28} className="text-blue-600" />
        <span className="text-blue-600">FiteAte</span>
      </div>

      {/* Prawy panel */}
      <div className="flex items-center space-x-6 min-w-[120px] justify-end">
        {userToken ? (
          user && (
            <div className="flex items-center space-x-2">
              <User size={20} strokeWidth={2} />
              <span className="text-sm font-semibold">{user.username}</span>
            </div>
          )
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
            >
              Zaloguj się
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
            >
              Zarejestruj się
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;
