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
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DEV_URL from '../Constants/Constants';
import { useNavigate } from 'react-router-dom';


const drawerWidth = 240;

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const limit = 6;
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${DEV_URL}/users/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${DEV_URL}/blog/all-blogs`, {
        params: {
          page,
          search,
          sort,
          category: filterCategory,
        },
      });
      setBlogs(response.data.blogs);
      setTotalPages(Math.ceil(response.data.totalBlogs / limit));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [page, search, sort, filterCategory]);

  const handleComment = (blogId) => {
    navigate(`/comments/${blogId}`);
  };  
  
  const handleLike = (blogId) => {
    // Handle like functionality (placeholder)
    console.log(`Liked blog: ${blogId}`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}>
        <Grid container spacing={2} mb={4}>
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

        {/* Filters */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            label="Search by title"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: '40%' }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="atoz">A - Z</MenuItem>
              <MenuItem value="ztoa">Z - A</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat.name}>
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Recent Blogs</Typography>
          {loading ? (
            <CircularProgress />
          ) : blogs.length === 0 ? (
            <Typography variant="body1">No blogs found.</Typography>
          ) : (
            <>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {blogs.map((blog) => (
                  <Box
                    key={blog._id}
                    component="li"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    py={2}
                    borderBottom={1}
                    borderColor="divider"
                  >
                    <Box>
                      <Typography variant="h6">{blog.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {blog.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {blog.blogId}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Link to={`/specificpost/${blog.blogId}`}>
                        <Typography variant="body2" color="primary">
                          View Post
                        </Typography>
                      </Link>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleLike(blog._id)}
                      >
                        Like
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleComment(blog.blogId)}
                      >
                        Comment
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box mt={3} display="flex" justifyContent="space-between">
                <Typography variant="body2">Page {page} of {totalPages}</Typography>
                <Box>
                  <Button variant="outlined" onClick={() => setPage(prev => prev - 1)} disabled={page === 1} sx={{ mr: 2 }}>
                    Previous
                  </Button>
                  <Button variant="outlined" onClick={() => setPage(prev => prev + 1)} disabled={page === totalPages}>
                    Next
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;