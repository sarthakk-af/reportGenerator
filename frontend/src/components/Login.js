import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const [login, setLogin] = useState('system');
    const [pass, setPass] = useState('system');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = async () => {
        try {
            if (login === 'system' && pass === 'system') {
                navigate('/home'); // Navigate to Home.js after successful login
            } else {
                alert('Authentication Failed :(');
            }
            setLogin(null);
            setPass(null);
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="d-flex flex-column justify-content-center align-items-center p-3 border border-primary ">
                <div className='mb-3'>
                    <input className='border border-primary' type="text" value={login} name="login" placeholder="Enter User ID" />
                </div>
                <div className='mb-3'>
                    <input className='border border-warning'  type="password" value={pass} name="password" placeholder="Enter Password" />
                </div>
                <div className="mt-3">
                    <button className='btn btn-primary' onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>

    );
};

export default Login;
