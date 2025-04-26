import { useNavigate } from 'react-router-dom';
import { User, UtensilsCrossed } from 'lucide-react';

const TopBar = ({ userToken, setUserToken, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUserToken(null);
    navigate('/');
  };

  return (
    <header className="bg-[#1f1f23] text-white flex items-center justify-between px-6 py-4 shadow-md w-full">
      <div className="flex items-center space-x-2 text-2xl font-bold tracking-wide">
        <UtensilsCrossed size={28} className="text-blue-500"/>
        <span className="text-blue-500">Fite ate</span>
      </div>
      <div className="flex items-center space-x-6">
        {userToken ? (
          <>
            {user && (
              <div className="flex items-center space-x-2">
                <User size={20} strokeWidth={2} />
                <span className="text-sm font-semibold">{user.username}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 transition-all duration-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            >
              Wyloguj się
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-green-600 hover:bg-green-700 transition-all duration-200 px-4 py-2 rounded-lg text-sm"
            >
              Zaloguj się
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-4 py-2 rounded-lg text-sm"
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
