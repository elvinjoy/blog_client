import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  CssBaseline,
  Toolbar,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import DEV_URL from '../Constants/Constants';

const AllBlogsAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Function to get the proper image URL from the server path
  const getImageUrl = useMemo(() => (imagePath) => {
    if (!imagePath) return null;
    
    // If the path already starts with http or https, it's an external URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Extract the base URL without '/api'
    const baseURL = DEV_URL.replace('/api', '');
    
    // Return the complete URL
    return `${baseURL}${imagePath}`;
  }, []);

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
        const blogsData = res.data.blogs || [];
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBlogs(blogs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = blogs.filter(blog => 
      blog.title?.toLowerCase().includes(query) ||
      blog.description?.toLowerCase().includes(query) ||
      blog.category?.toLowerCase().includes(query) ||
      blog.blogId?.toLowerCase().includes(query) ||
      blog.createdBy?.toLowerCase().includes(query)
    );
    
    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  const handleEdit = (blogId) => {
    // Use blogId (like BLOG001) instead of Mongo _id
    navigate(`/editblogsbyadmin/${blogId}`);
  };

  // Handle image loading error
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  };

  return (
    <Box sx={{ p: 3 }}>
      <CssBaseline />
      <Toolbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">All Blogs</Typography>
        <TextField
          placeholder="Search blogs..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', sm: 300 }, ml: { xs: 0, sm: 2 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredBlogs.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography>
            {blogs.length === 0 
              ? "No blogs found." 
              : "No blogs match your search criteria."}
          </Typography>
        </Paper>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredBlogs.length} of {blogs.length} blogs
          </Typography>
          
          {filteredBlogs.map((blog) => (
            <Paper key={blog._id} elevation={3} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
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
                </Grid>
                
                {blog.images && blog.images.length > 0 && (
                  <Grid item xs={12} md={3} display="flex" alignItems="center" justifyContent="center">
                    <Box
                      component="img"
                      sx={{
                        height: 150,
                        width: '100%',
                        maxWidth: 220,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                      src={getImageUrl(blog.images[0])}
                      alt={blog.title}
                      onError={handleImageError}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          ))}
        </>
      )}
    </Box>
  );
};

export default AllBlogsAdmin;