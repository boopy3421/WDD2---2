import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [values, setValues] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [requestError, setRequestError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, register } = useAuth();

    const validate = () => {
        const nextErrors = {};

        if (isRegisterMode && values.username.trim().length < 3) {
            nextErrors.username = 'Username must be at least 3 characters.';
        }

        if (!emailRegex.test(values.email)) {
            nextErrors.email = 'Please enter a valid email address.';
        }

        if (values.password.length < 6) {
            nextErrors.password = 'Password must be at least 6 characters.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (field) => (event) => {
        setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setRequestError('');

        if (!validate()) return;

        try {
            setLoading(true);

            if (isRegisterMode) {
                await register({
                    username: values.username.trim(),
                    email: values.email.trim(),
                    password: values.password,
                });
                setIsRegisterMode(false);
                setRequestError('Registration successful. You can now log in.');
            } else {
                await login({ email: values.email.trim(), password: values.password });
                navigate('/');
            }
        } catch (error) {
            setRequestError(error.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title={isRegisterMode ? 'Create Account' : 'Welcome Back'}>
            <form className="login-form" onSubmit={handleSubmit}>
                {requestError ? <div className="alert-error">{requestError}</div> : null}

                {isRegisterMode ? (
                    <Input
                        id="username"
                        label="Username"
                        value={values.username}
                        onChange={handleChange('username')}
                        placeholder="Enter your username"
                        error={errors.username}
                    />
                ) : null}

                <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange('email')}
                    placeholder="Enter your email"
                    error={errors.email}
                />

                <Input
                    id="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange('password')}
                    placeholder="Enter your password"
                    error={errors.password}
                />

                <Button type="submit" loading={loading}>
                    {isRegisterMode ? 'Sign Up' : 'Log In'}
                </Button>

                <p className="auth-link">
                    {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button type="button" onClick={() => setIsRegisterMode((prev) => !prev)}>
                        {isRegisterMode ? 'Log In' : 'Create one'}
                    </button>
                </p>
                <p className="auth-link">
                    <Link to="/">Back to Home</Link>
                </p>
            </form>
        </Card>
    );
};

export default Login;
