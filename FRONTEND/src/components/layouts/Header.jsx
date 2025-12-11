import { useDispatch } from 'react-redux';
import api from '../../tools/axios';
import { useNavigate } from 'react-router';
import { clearUser } from '../../store/authSlice';
const Header = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <div>
      Header
      <button onClick={handleLogout} style={{marginLeft: 16}}>Logout</button>
    </div>
  );
}

export default Header;
