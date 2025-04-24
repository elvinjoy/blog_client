import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  CssBaseline,
  Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DEV_URL from '../Constants/Constants';

const AllBlogsAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('Admin token not found');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${DEV_URL}/blog/all-blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleEdit = (blogId) => {
    // Use blogId (like BLOG001) instead of Mongo _id
    navigate(`/editblogsbyadmin/${blogId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <CssBaseline />
      <Toolbar />
      <Typography variant="h5" gutterBottom>All Blogs</Typography>

      {loading ? (
        <CircularProgress />
      ) : blogs.length === 0 ? (
        <Typography>No blogs found.</Typography>
      ) : (
        blogs.map((blog) => (
          <Paper key={blog._id} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{blog.title}</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Blog ID: {blog.blogId}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Category: {blog.category}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Author ID: {blog.createdBy}
            </Typography>
            <Typography variant="body1" mb={2}>{blog.description}</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEdit(blog.blogId)}
            >
              Edit
            </Button>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AllBlogsAdmin;
