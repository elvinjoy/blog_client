import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DEV_URL from '../Constants/Constants';

const Login = () => {
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State for loading
  const [loading, setLoading] = useState(false);

  // Destructure form data
  const { email, password } = formData;

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form completeness check
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }
    
    try {
      setLoading(true);
      
      // Make API request - rely on backend validation
      const response = await axios.post(`${DEV_URL}/users/login`, {
        email,
        password
      });
      
      // Save token and user data to local storage
      localStorage.setItem('token', response.data.token);
      // localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Show success message
      toast.success('Login successful!');
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      // Show error message from backend
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigate to admin login
  const goToAdminLogin = () => {
    navigate('/adminlogin');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {/* Admin login button in top right corner */}
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
          <Tooltip title="Admin Login">
            <IconButton 
              color="primary" 
              onClick={goToAdminLogin}
              aria-label="Admin Login"
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Forgot password?
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  {"Don't have an account? Sign Up"}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;