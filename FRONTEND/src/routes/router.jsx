import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/admin/Dashboard";
import DriverDashboard from "../pages/driver/DriverDashboard";
import PrivateRoute from "../components/layouts/PrivateLayout";
import Authorization from "../pages/auth/Authorization";
import Vehicles from "../pages/admin/Vehicles";
import Tires from "../pages/admin/Tires";
import Trips from "../pages/admin/Trips";
import MyTrips from "../pages/driver/MyTrips";
import MyVehicle from "../pages/driver/MyVehicle";

const router = [
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'authorized', element: <Authorization /> },
    {
        path: 'admin',
        element: <PrivateRoute allowedRoles={['Admin']}/>,
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'vehicles', element: <Vehicles /> },
            { path: 'tires', element: <Tires /> },
            { path: 'trips', element: <Trips /> }
        ]
    },
    {
        path: 'driver',
        element: <PrivateRoute allowedRoles={['Driver']}/>,
        children: [
            { path: 'dashboard', element: <DriverDashboard /> },
            { path: 'my-trips', element: <MyTrips /> }
            ,{ path: 'my-vehicle', element: <MyVehicle /> }
        ]
    }
];

export default router;