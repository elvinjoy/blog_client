import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DEV_URL from '../Constants/Constants'; // Your API base URL

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [retryOtp, setRetryOtp] = useState(false);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${DEV_URL}/users/forgot-password`, { email });
      const generatedOtp = response.data.otp;
      setMessage('OTP sent successfully.');
      setError('');
      setStep(2);
      setRetryOtp(false);

      toast.success(`Your OTP is: ${generatedOtp}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
      setRetryOtp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${DEV_URL}/users/verify-otp`, { email, otp });
      setResetToken(response.data.resetToken);
      setMessage('OTP verified. You can now reset your password.');
      setError('');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${DEV_URL}/users/reset-password`,
        {
          email,
          password: newPassword,
          confirmPassword: confirmPassword, // ✅ Added confirmPassword
        },
        {
          headers: { Authorization: `Bearer ${resetToken}` },
        }
      );
      setMessage('Password reset successfully. Redirecting...');
      setError('');

      toast.success('Password reset successful! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Box
        bgcolor="white"
        p={4}
        borderRadius={3}
        boxShadow={3}
        width="100%"
        maxWidth={400}
        textAlign="center"
      >
        <Typography variant="h5" mb={3}>
          {step === 1 && 'Forgot Password'}
          {step === 2 && 'Verify OTP'}
          {step === 3 && 'Reset Password'}
        </Typography>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {step === 1 && (
          <>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSendOtp}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              fullWidth
              label="Enter OTP"
              variant="outlined"
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleVerifyOtp}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleSendOtp}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Retry OTP'}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleResetPassword}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
