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
  Badge,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import LoginIcon from '@mui/icons-material/Login';
import DEV_URL from '../Constants/Constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const [likedBlogs, setLikedBlogs] = useState({});
  const [likesLoading, setLikesLoading] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const limit = 6;
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

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

      // Check user's liked status for each blog
      const token = localStorage.getItem('token');
      if (token) {
        checkUserLikes(response.data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  // Check which blogs the current user has liked
  const checkUserLikes = async (blogsList) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${DEV_URL}/blog/user-likes`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userLikedBlogIds = response.data.likedBlogs || [];
      const likedStatus = {};

      blogsList.forEach(blog => {
        likedStatus[blog.blogId] = userLikedBlogIds.includes(blog.blogId);
      });

      setLikedBlogs(likedStatus);
    } catch (error) {
      console.error('Error checking user likes:', error);
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

  const handleLike = async (blogId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to like a blog');
      return;
    }

    try {
      // Set loading state for this specific blog
      setLikesLoading(prev => ({ ...prev, [blogId]: true }));

      // Toggle like status
      const action = likedBlogs[blogId] ? 'unlike' : 'like';

      // Call API to like/unlike the blog
      await axios.post(
        `${DEV_URL}/blog/${action}/${blogId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setLikedBlogs(prev => ({
        ...prev,
        [blogId]: !prev[blogId]
      }));

      // Update the likes count in the blogs array
      setBlogs(blogs.map(blog => {
        if (blog.blogId === blogId) {
          return {
            ...blog,
            likesCount: action === 'like'
              ? (blog.likesCount || 0) + 1
              : Math.max((blog.likesCount || 0) - 1, 0)
          };
        }
        return blog;
      }));

      toast.success(action === 'like' ? 'Blog liked!' : 'Blog unliked');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error(error.response?.data?.message || 'Failed to process like');
    } finally {
      setLikesLoading(prev => ({ ...prev, [blogId]: false }));
    }
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
          {isLoggedIn ? (
            <Button 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<LoginIcon />}
            >
              Logout
            </Button>
          ) : (
            <Button 
              color="inherit" 
              onClick={handleLogin}
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          )}
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
              <MenuItem value="mostLiked">Most Liked</MenuItem>
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
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
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
                      <Box display="flex" alignItems="center" gap={2} mt={1}>
                        <Tooltip title="Likes">
                          <Badge
                            badgeContent={blog.likesCount || 0}
                            color="primary"
                            sx={{ mr: 1 }}
                          >
                            <ThumbUpOutlinedIcon fontSize="small" color="action" />
                          </Badge>
                        </Tooltip>
                        <Typography variant="body2" color="textSecondary">
                          {blog.category}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {blog.blogId}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            weekday: 'short',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Link to={`/specificpost/${blog.blogId}`}>
                        <Button variant="text" size="small">
                          View Post
                        </Button>
                      </Link>
                      <Button
                        variant="outlined"
                        color={likedBlogs[blog.blogId] ? "primary" : "inherit"}
                        size="small"
                        onClick={() => handleLike(blog.blogId)}
                        startIcon={likesLoading[blog.blogId] ?
                          <CircularProgress size={16} /> :
                          (likedBlogs[blog.blogId] ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />)
                        }
                        disabled={likesLoading[blog.blogId]}
                      >
                        {blog.likesCount || 0}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleComment(blog.blogId)}
                        startIcon={<CommentIcon />}
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