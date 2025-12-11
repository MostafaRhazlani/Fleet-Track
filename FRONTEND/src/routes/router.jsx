import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/admin/Dashboard";
import DriverDashboard from "../pages/driver/DriverDashboard";
import PrivateRoute from "../components/layouts/PrivateLayout";
import Authorization from "../pages/auth/Authorization";

const router = [
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'authorized', element: <Authorization /> },
    {
        path: 'admin',
        element: <PrivateRoute allowedRoles={['Admin']}/>,
        children: [
            { path: 'dashboard', element: <Dashboard /> }
        ]
    },
    {
        path: 'driver',
        element: <PrivateRoute allowedRoles={['Driver']}/>,
        children: [
            { path: 'dashboard', element: <DriverDashboard /> }
        ]
    }
];

export default router;