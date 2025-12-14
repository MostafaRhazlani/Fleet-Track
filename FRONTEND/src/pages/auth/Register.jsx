import { useState } from 'react';
import { User, Mail, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import api from '../../tools/axios';
import logo from '../../assets/logo/fleet_track_logo.png';
import Input from '../../components/UI/Input';
import PrimaryButton from '../../components/UI/PrimaryButton';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    // validation Logic
    const validateField = (name, value) => {
        let errorMsg = "";

        switch (name) {
            case 'firstName':
                if (!value.trim()) errorMsg = "First name is required";
                break;

            case 'lastName':
                if (!value.trim()) errorMsg = "Last name is required";
                break;

            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) errorMsg = "Email is required";
                else if (!emailRegex.test(value)) errorMsg = "Invalid email address";
                break;
            }

            case 'phone':
                if (!value.trim()) errorMsg = "Phone number is required";
                break;

            case 'password':
                if (!value) errorMsg = "Password is required";
                else if (value.length < 6) errorMsg = "Password must be at least 6 characters";
                break;

            case 'confirmPassword':
                if (!value) errorMsg = "Please confirm your password";
                else if (value !== formData.password) errorMsg = "Passwords do not match";
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

    // handle blur event 
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

        // validate all fields before send
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
            await api.post('/auth/register', {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });

            navigate('/login');
        } catch (err) {
            const serverError = err.response?.data?.errors || 'Registration failed';
            setErrors({[Object.keys(serverError)]: serverError.emailExist});
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
            <div className="w-full md:w-7/12 p-8 flex flex-col justify-center bg-white">
                <div className="max-w-lg mx-auto w-full">

                    {/* Mobile Logo (Visible only on small screens) */}
                    <div className="w-28 mb-6 md:hidden">
                        <img src={logo} alt="" className='w-full h-full' />
                    </div>

                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Create your account</h1>
                    <p className="text-gray-500 mb-8">Join the platform to gain real-time visibility over your fleet.</p>

                    <form onSubmit={handleSubmit} encType='multipart/form-data' className="space-y-4">
                        <div className='grid md:grid-cols-2 gap-4'>
                            <Input
                                className="w-full"
                                label="First Name"
                                name="firstName"
                                placeholder="e.g. Alex"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.firstName}
                                icon={User}
                            />
                            <Input
                                className="w-full"
                                label="Last Name"
                                name="lastName"
                                placeholder="e.g. Jordan"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.lastName}
                                icon={User}
                            />
                        </div>
                        <div className='grid md:grid-cols-2 gap-4'>
                            <Input
                                className="w-full"
                                label="Phone Number"
                                name="phone"
                                placeholder="e.g. +212612345678"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.phone}
                                icon={User}
                            />

                            {/* Email Input */}
                            <Input
                                className="w-full"
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.email || errors.emailExist}
                                icon={Mail}
                            />
                        </div>

                        {/* Password Input */}
                        <Input
                            className="w-full"
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.password}
                            icon={showPassword ? EyeOff : Eye}
                            onIconClick={() => setShowPassword(!showPassword)}
                        />

                        {/* Confirm Password Input */}
                        <Input
                            className="w-full"
                            label="Confirm password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.confirmPassword}
                            icon={showConfirmPassword ? EyeOff : Eye}
                            onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                        <PrimaryButton className="mt-4 w-full" title="Create account" type="submit" />
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link to="/login" className="font-semibold text-primary hover:text-primary_hover hover:underline">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;