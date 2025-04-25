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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (query = '', page = 1) => {
    const token = localStorage.getItem('adminToken');
    try {
      setLoading(true);
      const res = await axios.get(`${DEV_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: query,
          page,
          limit: 5,
        },
      });
      setUsers(res.data.users || []);
      setCurrentPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

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
      fetchUsers(searchQuery, currentPage); // refetch updated list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // reset page when search changes
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Manage Users</Typography>
        <TextField
          label="Search Users"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Stack>

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

      {/* Pagination Controls */}
      {users.length > 0 && (
        <Stack direction="row" spacing={2} mt={3} alignItems="center">
          <Button
            variant="contained"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Typography>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </Stack>
      )}

      <ToastContainer />
    </Box>
  );
};

export default ManageUsers;
