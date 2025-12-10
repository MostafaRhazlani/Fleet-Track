import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const router = [
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> }
]

export default router;