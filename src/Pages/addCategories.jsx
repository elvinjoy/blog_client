import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Paper,
} from '@mui/material';
import DEV_URL from '../Constants/Constants';

const AddCategories = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('adminToken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post(
        `${DEV_URL}/admin/add-categories`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      setName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
          Add New Category
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Add Category
          </Button>
        </Box>

        {message && (
          <Alert severity="success" sx={{ mt: 3, textAlign: 'center' }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 3, textAlign: 'center' }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default AddCategories;
