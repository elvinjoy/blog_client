import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from the API
  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/blog/all-blogs');
      setBlogs(response.data.blogs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: 'primary.main' }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            User Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            PostSphere
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dashboard">
              <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/posts">
              <ListItemIcon><ArticleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Posts" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/add-post">
              <ListItemIcon><AddCircleOutlineIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Add Post" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}
      >
        {/* Stats */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography color="textSecondary" variant="subtitle2">Total Posts</Typography>
              <Typography variant="h5" fontWeight="bold">120</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography color="textSecondary" variant="subtitle2">Drafts</Typography>
              <Typography variant="h5" fontWeight="bold">5</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography color="textSecondary" variant="subtitle2">Visitors</Typography>
              <Typography variant="h5" fontWeight="bold">8,940</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Blogs Section */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Recent Blogs</Typography>
          {loading ? (
            <CircularProgress />
          ) : blogs.length === 0 ? (
            <Typography variant="body1">No blogs found.</Typography>
          ) : (
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {blogs.map((blog) => (
                <Box key={blog._id} component="li" display="flex" justifyContent="space-between" py={2} borderBottom={1} borderColor="divider">
                  <Box>
                    <Typography variant="h6">{blog.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{blog.category}</Typography>
                    <Typography variant="body2" color="textSecondary">{blog.createdAt}</Typography>
                  </Box>
                  <Link to={`/posts/${blog.blogId}`}>
                    <Typography variant="body2" color="primary">View Post</Typography>
                  </Link>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
