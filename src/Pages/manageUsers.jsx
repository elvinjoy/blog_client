import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, CircularProgress, CssBaseline, Toolbar } from '@mui/material';
import DEV_URL from '../Constants/Constants';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('adminToken'); // 🔐 Get token from localStorage
      try {
        const res = await axios.get(`${DEV_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <CssBaseline />
      <Toolbar />
      <Typography variant="h5" gutterBottom>Manage Users</Typography>

      {loading ? (
        <CircularProgress />
      ) : users.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        users.map((user) => (
          <Paper key={user._id} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{user.username}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>User Number: {user.userNumber}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ManageUsers;
