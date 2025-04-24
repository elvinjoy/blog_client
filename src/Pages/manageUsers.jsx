import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DEV_URL from '../Constants/Constants';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users from the server
  const fetchUsers = async () => {
    const token = localStorage.getItem('adminToken');
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (userId) => {
    const token = localStorage.getItem('adminToken');
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');
    if (!isConfirmed) return;

    try {
      await axios.delete(`${DEV_URL}/admin/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.userNumber !== userId));
      toast.success('User deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Manage Users</Typography>
        <TextField
          label="Search Users"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Stack>
      {loading ? (
        <CircularProgress />
      ) : filteredUsers.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        filteredUsers.map((user) => (
          <Paper key={user._id} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{user.username}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>User Number: {user.userNumber}</Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 1 }}
              onClick={() => handleDelete(user.userNumber)}
            >
              Delete
            </Button>
          </Paper>
        ))
      )}
      <ToastContainer />
    </Box>
  );
};

export default ManageUsers;
