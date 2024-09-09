import React, { useState } from 'react';
import axios from 'axios';
import UseNotification from '../notify/UseNotification';

const RegisterForm = ({ onToggleForm }) => {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const { notifyInfo, notifySuccess, notifyError } = UseNotification();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const registerData = { username, email, phone, password };
        try {
            await axios.post(`${apiUrl}/api/auth/register`, registerData);
            onToggleForm(); // After successful registration, switch to the login form
            notifySuccess("Congratulations, you are successfully registered.");
        } catch (error) {
            console.error('Error registering user:', error);
            notifyError("Error registering user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex justify-center items-center min-h-screen bg-light-background dark:bg-dark-background pt-16 px-4">
            <div className="text-center p-6 sm:p-8 text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background w-full max-w-lg border-2 border-light-border dark:border-dark-border rounded-3xl shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-6">REGISTER FORM</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 sm:mb-6">
                        <input
                            type="text"
                            placeholder="Username"
                            id="username"
                            className="w-full px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-md"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 sm:mb-6">
                        <input
                            type="email"
                            placeholder="Email"
                            id="email"
                            className="w-full px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 sm:mb-6">
                        <input
                            type="text"
                            placeholder="Phone"
                            id="phone"
                            className="w-full px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-md"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4 sm:mb-6">
                        <input
                            type="password"
                            placeholder="Password"
                            id="password"
                            className="w-full px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        className="w-full bg-light-button1 hover:bg-light-button1h dark:bg-dark-button1 dark:hover:bg-dark-button1h text-light-text dark:text-dark-text font-medium rounded-xl py-2 transition duration-300"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="mt-6">
                    Already have an account?{' '}
                    <button
                        type="button"
                        className="text-light-button1h hover:text-light-button1 dark:text-dark-button1 dark:hover:text-dark-button1h font-medium transition duration-300"
                        onClick={onToggleForm}
                    >
                        Login
                    </button>
                </p>
            </div>
        </section>
    );
};

export default RegisterForm;
