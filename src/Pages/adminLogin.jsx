import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DEV_URL from '../Constants/Constants';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');

    try {
      setLoading(true);
      const response = await axios.post(`${DEV_URL}/admin/login`, { email, password });
      localStorage.setItem('adminToken', response.data.token);
      toast.success('Admin login successful!');
      navigate('/admindashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <AdminPanelSettingsIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Admin Login</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField fullWidth required margin="normal" label="Email" name="email" autoComplete="email" value={email} onChange={handleChange} />
          <TextField fullWidth required margin="normal" label="Password" type="password" name="password" autoComplete="current-password" value={password} onChange={handleChange} />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
