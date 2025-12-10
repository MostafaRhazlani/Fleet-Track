import React, { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import api from '../../tools/axios';
import logo from '../../assets/logo/fleet_track_logo.png';
import Input from '../../components/UI/Input';
import PrimaryButton from '../../components/UI/PrimaryButton';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    // Validation logic
    const validateField = (name, value) => {
        let errorMsg = "";
        switch (name) {
            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) errorMsg = "Email is required";
                else if (!emailRegex.test(value)) errorMsg = "Invalid email address";
                break;
            }
            case 'password':
                if (!value) errorMsg = "Password is required";
                else if (value.length < 6) errorMsg = "Password must be at least 6 characters";
                break;
            default:
                break;
        }
        return errorMsg;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const errorMsg = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: errorMsg
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate all fields before send
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            const res = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });
            const user = res.data?.user;
            if (user?.role === 'Admin') {
                navigate('/admin/dashboard');
            } else if (user?.role === 'Driver') {
                navigate('/driver/dashboard');
            }
        } catch (err) {
            const serverError = err.response?.data?.errors || 'Login failed';
            setErrors({[Object.keys(serverError)]: serverError.invalidCredentials});
            console.log(serverError);
        }
    };

    return (
        <div className="min-h-screen bg-white w-full overflow-hidden flex flex-col md:flex-row relative">
            {/* Left Side - Image & Testimonial */}
            <div className="hidden md:flex md:w-5/12 relative bg-gray-900 text-white flex-col justify-between overflow-hidden">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://truckfile.co.uk/wp-content/uploads/2025/03/AdobeStock_568125432-1024x683.jpeg"
                        alt="Office background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-gray-900/30 to-gray-900/90 mix-blend-multiply" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-12 flex flex-col h-full justify-between">
                    {/* Logo */}
                    <div className="w-28">
                        <img src={logo} alt="" className='w-full h-full' />
                    </div>

                    {/* Testimonial */}
                    <div className="mb-10">
                        <p className="text-3xl font-medium leading-snug mb-6">
                            "We finally said goodbye to Excel sheets. Now we track fuel, tires, and driver routes in real-time."
                        </p>
                        <div>
                            <p className="font-semibold text-lg">Mostafa Rhazlani</p>
                            <p className="text-gray-300 text-sm">Fleet Operations Manager</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-7/12 p-8 md:p-16 overflow-y-auto flex flex-col justify-center bg-white">
                <div className="max-w-md mx-auto w-full">

                    {/* Mobile Logo (Visible only on small screens) */}
                    <div className="w-28 mb-6 md:hidden">
                        <img src={logo} alt="" className='w-full h-full' />
                    </div>

                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome back</h1>
                    <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.general && (
                            <div className="text-red-500 text-sm mb-2">{errors.general}</div>
                        )}
                        <Input
                            label="Email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.email || errors.invalidCredentials}
                            icon={Mail}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.password || errors.invalidCredentials}
                            icon={showPassword ? EyeOff : Eye}
                            onIconClick={() => setShowPassword(!showPassword)}
                        />
                        <div className="flex justify-end mb-0">
                            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </a>
                        </div>
                        <PrimaryButton title="Log in" type="submit" />
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;