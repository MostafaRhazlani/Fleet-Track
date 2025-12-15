import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import { setUser } from '../../store/authSlice';
import { useAuthenticatedUser } from '../../hooks/auth';
import Header from './Header';
import Navbar from './Navbar';

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const userState = useSelector(state => state.auth.user);
  const { user: fetchedUser, loading } = useAuthenticatedUser();

  useEffect(() => {
    if (fetchedUser && !userState) {
      dispatch(setUser(fetchedUser));
    }
  }, [fetchedUser, userState, dispatch]);

  if (loading && !userState) {
    return <div className="text-center p-10">Loading authentication...</div>;
  }

  const currentUser = userState || fetchedUser;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/authorized" replace />;
  }

  return (
    <>
      <Header />
      <Navbar />
      <main className='bg-indigo-200/20 w-full min-h-screen pt-10'>
        <div className='w-11/12 lg:w-4/5 mx-auto'>
          <Outlet />
        </div>
      </main>
    </>
  )
};

export default PrivateRoute;
