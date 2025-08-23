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
            <div className="d-flex flex-column justify-content-center align-items-center p-3 border border-secondary border border-2">

                <div className='mb-2'>
                    <div className="input-group mb-2">
                        <div className="input-group-text border border-2 border-secondary" style={{ height: '100%', minWidth: '3rem' }}> @ </div>
                        <input className='form-control border border-2 border-secondary' style={{ width: '20vw' }} type="text" value={login} name="login" placeholder="Enter User ID" />
                    </div>
                </div>

                <div className='input-group mb-5'>
                    <div className="input-group-text border border-2 border-secondary" style={{ height: '100%', minWidth: '3rem' }}> *** </div>
                    <input className='form-control border border-2 border-secondary' type="password" value={pass} name="password" placeholder="Enter Password" />
                </div>


                <div className='mt-1 d-grid gap-2 col-12 mx-auto'>
                    <button className='btn btn-success' type='button' onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>

    );
};

export default Login;
