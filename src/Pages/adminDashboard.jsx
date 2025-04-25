import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    Box,
    CssBaseline,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    CircularProgress
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import DEV_URL from '../Constants/Constants';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ✅ Correct usage inside the component

    // Fetch blogs on component mount
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${DEV_URL}/blog/all-blogs`);
                setBlogs(res.data?.blogs || []);
            } catch (err) {
                console.error('Error fetching blogs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Admin Dashboard
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
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                        AdminPanel
                    </Typography>
                </Toolbar>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon><DashboardIcon color="secondary" /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/manageusers')}>
                            <ListItemIcon><SupervisedUserCircleIcon color="secondary" /></ListItemIcon>
                            <ListItemText primary="Manage Users" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/allblogsadmin')}>
                            <ListItemIcon><SettingsIcon color="secondary" /></ListItemIcon>
                            <ListItemText primary="Manage Blogs" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/add-categories')}>
                            <ListItemIcon><CategoryIcon color="secondary" /></ListItemIcon>
                            <ListItemText primary="add-Categories" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/allcategories')}>
                            <ListItemIcon><CategoryIcon color="secondary" /></ListItemIcon>
                            <ListItemText primary="Manage Categories" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Typography variant="h6" gutterBottom>Welcome, Admin!</Typography>
                <Typography variant="body2" mb={3}>
                    Use the sidebar to manage users, content, and settings.
                </Typography>

                {loading ? (
                    <CircularProgress />
                ) : blogs.length === 0 ? (
                    <Typography>No blogs found.</Typography>
                ) : (
                    blogs.map((blog) => (
                        <Paper key={blog._id} elevation={3} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6">{blog.title}</Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                By: {blog.author?.username || 'Admin'}
                            </Typography>
                            <Typography variant="body1">{blog.content}</Typography>
                        </Paper>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default AdminDashboard;
