import React, { useState } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import baseUrl from "../../../config";
import { useFormik } from 'formik';
import { LoginSchema } from './validationSchema';
import './Auth.css';

const Login = ({ getUserData }) => {
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('')
    // const [user, setUser] = useState({
    //     email: '',
    //     password: '',
    // });

    // const inputEvent = (e) => {
    //     setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // };

    const handleLoginSubmit = async (e) => {
        // e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(formik.values),
            });

            const data = await response.json();

            if (data.status === 'ok') {
                alert('Login successfully');
                window.localStorage.setItem('token', data.data);
                window.localStorage.setItem('isLogin', true);
                getUserData();
                navigate('/');
            }
            else if (data.status === 'error')
                setAuthError(data.message);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: handleLoginSubmit
    });

    return (
        <Grid
            container
            columns={16}
            sx={{
                background: 'var(--primary-10)',
                minHeight: '90vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Grid item xs={14} sm={10} md={6} xl={5} className="authContainer">
                <Typography
                    variant="h4"
                    gutterBottom
                    className="authHead"
                    sx={{ mb: 5, color: 'var(--primary-30)' }}
                >
                    Sign in to your account
                </Typography>
                <form noValidate onSubmit={formik.handleSubmit}>
                    {['email', 'password'].map((field) => (
                        <TextField
                            key={field}
                            fullWidth
                            placeholder={`Enter ${field}`}
                            id="fullWidth"
                            className="inputField"
                            name={field}
                            // onChange={inputEvent}
                            value={formik.values[field]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched[field] && Boolean(formik.errors[field])}
                            helperText={formik.touched[field] && formik.errors[field]}
                        />
                    ))}
                    {authError && (
                        <Typography variant="div" color="error">
                            {authError}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 5 }}
                        className="authMainBtn"
                    >
                        Login
                    </Button>

                    <Typography variant="div" gutterBottom>
                        <Typography variant="span" sx={{ mb: 5 }}>
                            Don't have an account?
                        </Typography>
                        <Button
                            variant="text"
                            className="authNavBtn"
                            onClick={() => navigate('/signup')}
                        >
                            Signup
                        </Button>
                    </Typography>
                </form>
            </Grid>
        </Grid>
    );
};

export default Login;
