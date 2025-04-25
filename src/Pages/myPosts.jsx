import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Grid, Button, CardMedia } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DEV_URL from '../Constants/Constants'; // Make sure path is correct
import { jwtDecode } from 'jwt-decode';

const AllPostsByMe = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Memoize fetchPosts function to prevent recreating it on every render
    const fetchPosts = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to view your posts');
            setLoading(false);
            return;
        }

        console.log('Fetching posts...');

        let userNumber = '';
        try {
            const decodedToken = jwtDecode(token);
            userNumber = decodedToken.userNumber;
        } catch (error) {
            console.error('Error decoding token:', error);
            setError('Invalid token');
            setLoading(false);
            return;
        }

        if (!userNumber) {
            setError('User number not found in the token');
            setLoading(false);
            return;
        }

        try {
            const apiUrl = `${DEV_URL}/users/blogs/${userNumber}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching posts');
            }

            const data = await response.json();
            setPosts(data.blogs || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    // Only run the fetch once when component mounts
    useEffect(() => {
        fetchPosts();
        // No dependencies array - ensures it only runs once when component mounts
    }, [fetchPosts]);

    // Handle edit button click
    const handleEditClick = (blogId) => {
        navigate(`/edit-blog/${blogId}`);
    };

    // Function to get the full image URL
    // Function to get the full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;

        // If the path already starts with http or https, it's an external URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // Extract the base URL without '/api'
        const baseURL = DEV_URL.replace('/api', '');

        // Otherwise, it's a relative path from your server
        return `${baseURL}${imagePath}`;
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    My Posts
                </Typography>
                <Button variant="contained" color="primary" component={Link} to="/add-post">
                    Add New Post
                </Button>
            </Box>

            {/* Posts List */}
            <Box display="flex" flexDirection="column" gap={3}>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Paper
                            key={post._id}
                            elevation={3}
                            sx={{ p: 3, width: '100%', maxWidth: 800, mx: 'auto' }}
                        >
                            <Grid container spacing={2}>
                                {post.images && post.images.length > 0 && (
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                                            {post.images.map((image, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        minWidth: 200,
                                                        height: 150,
                                                        borderRadius: 1,
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        height="150"
                                                        image={getImageUrl(image)}
                                                        alt={`Image ${index + 1} for ${post.title}`}
                                                        sx={{
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.3s',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)'
                                                            }
                                                        }}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            // Use a base64 encoded image instead of an external URL
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Typography variant="h6" mb={1}>
                                    Title: {post.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" mb={2}>
                                        Published: {new Date(post.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" mb={2}>
                                       Description: {post.description}
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleEditClick(post.blogId)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    {/* <Button
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        component={Link}
                                        to={`/blog/${post.blogId}`}
                                    >
                                        View Full Post
                                    </Button> */}
                                </Grid>
                            </Grid>
                        </Paper>
                    ))
                ) : (
                    <Typography variant="h6">No posts available</Typography>
                )}
            </Box>
        </Box>
    );
};

export default AllPostsByMe;