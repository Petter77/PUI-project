import { useNavigate } from 'react-router-dom';
import { Home, CookingPot, Heart, User, LogOut } from 'lucide-react';
import clsx from 'clsx';

const SideBar = ({ user, isOpen, setUserToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUserToken(null);
    navigate('/');
  };

  const baseButton =
    'transition-all duration-300 w-full px-4 py-2 hover:bg-gray-100 hover:text-blue-500';

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', route: '/' },
    { icon: <CookingPot size={24} />, label: 'My Recipes', route: '/my-recipes', auth: true },
    { icon: <Heart size={24} />, label: 'Meal Plans', route: '/my-meal-plans', auth: true },
    { icon: <User size={24} />, label: 'Profile', route: '/user-profile', auth: true },
  ];

  return (
    <aside
      className={clsx(
        'bg-white text-black shadow-md h-[calc(100vh-64px)] transition-all duration-300 z-40',
        isOpen
          ? 'w-full sm:w-64 fixed sm:sticky top-[64px] left-0'
          : 'w-20 sm:w-20 sticky top-[64px]'
      )}
    >
      <div className="flex flex-col pt-6 space-y-1 h-full">
        {navItems
          .filter((item) => !item.auth || user)
          .map(({ icon, label, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className={clsx(baseButton, 'flex items-center justify-start')}
            >
              <div
                className={clsx(
                  'flex justify-center items-center transition-all duration-300',
                  isOpen ? 'w-12' : 'w-full justify-center'
                )}
              >
                {icon}
              </div>
              <span
                className={clsx(
                  'text-sm transition-all duration-300 origin-left',
                  isOpen ? 'opacity-100 ml-2' : 'opacity-0 w-0 overflow-hidden'
                )}
              >
                {label}
              </span>
            </button>
          ))}

        {/* Przycisk wylogowania */}
        {user && (
          <button
            onClick={handleLogout}
            className={clsx(
              baseButton,
              'flex items-center justify-start mt-auto mb-4'
            )}
          >
            <div
              className={clsx(
                'flex justify-center items-center transition-all duration-300',
                isOpen ? 'w-12' : 'w-full justify-center'
              )}
            >
              <LogOut size={24} />
            </div>
            <span
              className={clsx(
                'text-sm transition-all duration-300 origin-left',
                isOpen ? 'opacity-100 ml-2' : 'opacity-0 w-0 overflow-hidden'
              )}
            >
              Wyloguj się
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default SideBar;

