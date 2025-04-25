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
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Badge,
    Chip,
    Tooltip,
    Button
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import DEV_URL from '../Constants/Constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const drawerWidth = 240;

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('latest');
    const [filterCategory, setFilterCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const blogsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogsRes, categoriesRes] = await Promise.all([
                    axios.get(`${DEV_URL}/blog/all-blogs`),
                    axios.get(`${DEV_URL}/users/categories`)
                ]);

                setBlogs(blogsRes.data?.blogs || []);
                setCategories(categoriesRes.data?.categories || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let result = [...blogs];

        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(blog =>
                blog.title?.toLowerCase().includes(searchLower) ||
                blog.description?.toLowerCase().includes(searchLower) ||
                blog.createdBy?.toLowerCase().includes(searchLower)
            );
        }

        if (filterCategory) {
            result = result.filter(blog => blog.category === filterCategory);
        }

        switch (sort) {
            case 'latest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'atoz':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'ztoa':
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'mostLiked':
                result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
                break;
            default:
                break;
        }

        setTotalPages(Math.ceil(result.length / blogsPerPage));

        const startIndex = (page - 1) * blogsPerPage;
        const paginatedResult = result.slice(startIndex, startIndex + blogsPerPage);

        setFilteredBlogs(paginatedResult);
    }, [blogs, search, sort, filterCategory, page]);

    useEffect(() => {
        setPage(1);
    }, [search, filterCategory, sort]);

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
                            <ListItemText primary="Add Categories" />
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
                <Typography variant="h5" gutterBottom>Blog Management</Typography>
                <Typography variant="body2" mb={3}>
                    View all blog posts from this dashboard.
                </Typography>

                {/* Filter and Search Section */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Search Blogs"
                                variant="outlined"
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title, description or author"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sort}
                                    label="Sort By"
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <MenuItem value="latest">Latest First</MenuItem>
                                    <MenuItem value="oldest">Oldest First</MenuItem>
                                    <MenuItem value="atoz">A to Z</MenuItem>
                                    <MenuItem value="ztoa">Z to A</MenuItem>
                                    <MenuItem value="mostLiked">Most Liked</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Filter by Category</InputLabel>
                                <Select
                                    value={filterCategory}
                                    label="Filter by Category"
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <MenuItem value="">All Categories</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category._id} value={category.name}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                {/* Blogs List */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredBlogs.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography>No blogs found matching your criteria.</Typography>
                    </Paper>
                ) : (
                    <>
                        {filteredBlogs.map((blog) => (
                            <Paper key={blog._id} elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="h6" fontWeight="bold">{blog.title}</Typography>
                                    <Chip
                                        label={blog.category || 'Uncategorized'}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {blog.description}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Author: <strong>{blog.createdBy || 'Unknown'}</strong>
                                    </Typography>
                                    <Divider orientation="vertical" flexItem />
                                    <Typography variant="body2" color="text.secondary">
                                        Published: {new Date(blog.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Divider orientation="vertical" flexItem />
                                    <Tooltip title="Likes">
                                        <Badge badgeContent={blog.likesCount || 0} color="primary">
                                            <Typography variant="body2" color="text.secondary">
                                                Likes
                                            </Typography>
                                        </Badge>
                                    </Tooltip>
                                    <Divider orientation="vertical" flexItem />
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {blog.blogId}
                                    </Typography>
                                </Box>
                            </Paper>
                        ))}

                        {/* Pagination */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                            <Typography variant="body2">
                                Page {page} of {totalPages || 1}
                            </Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    disabled={page <= 1}
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    sx={{ mr: 1 }}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outlined"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default AdminDashboard;
