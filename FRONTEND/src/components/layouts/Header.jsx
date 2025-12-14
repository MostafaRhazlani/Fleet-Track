import { useDispatch, useSelector } from 'react-redux';
import api from '../../tools/axios';
import { useNavigate, useLocation, Link } from 'react-router';
import { clearUser } from '../../store/authSlice';
import { Bell } from 'lucide-react';

import logo from "../../assets/logo/fleet_track_logo.png";
const Header = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const adminMenu = [
    { path: '/admin/dashboard', title: 'Dashboard' },
    { path: '/admin/vehicles', title: 'Vehicles' },
    { path: '/admin/tires', title: 'Tires' },
    { path: '/admin/trips', title: 'Trips' },
  ];

  const driverMenu = [
    { path: '/driver/dashboard', title: 'Dashboard' },
    { path: '/driver/my-trips', title: 'My Trips' },
  ];

  const headerMenu = user?.role === 'Driver' ? driverMenu : adminMenu;

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('logout failed', error);
    } finally {
      dispatch(clearUser());
      navigate('/login');
    }
  };

  return (
    <header className="flex md:flex-row items-center justify-between p-4 md:px-10 py-2 bg-white gap-4 sticky top-0 z-20">
      <div className="flex items-center gap-8 w-full">
        <div className="w-28">
          <img src={logo} alt="" />
        </div>

        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full">
          {headerMenu.map((item, index) => (
            <Link to={item.path}
              key={index}
              className={`px-5 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-200 ${item.path === location.pathname
                  ? 'bg-primary/15 text-primary'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 w-full justify-end">
        <button className="p-2.5 group hover:bg-gray-100 rounded-full relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-800" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div onClick={handleLogout} className="w-10 h-10 bg-indigo-100 hover:border-2 hover:border-primary cursor-pointer transition-all duration-300 rounded-full border-2 border-white shadow-sm overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </div>
    </header>
  );
}

export default Header;