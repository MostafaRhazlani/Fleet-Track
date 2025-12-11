import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import { setUser } from '../../store/authSlice';
import { useAuthenticatedUser } from '../../hooks/auth';
import Header from './Header';

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const userState = useSelector(state => state.auth.user);
  const { user: fetchedUser, loading } = useAuthenticatedUser();

  useEffect(() => {
    if (!fetchedUser) {
      dispatch(setUser(fetchedUser));
    }
  }, [fetchedUser, dispatch]);

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
      <Outlet />;
    </>
  )
};

export default PrivateRoute;
