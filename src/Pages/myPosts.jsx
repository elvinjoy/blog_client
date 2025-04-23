import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DEV_URL from '../Constants/Constants'; // Make sure path is correct
import { jwtDecode } from 'jwt-decode';

const AllPostsByMe = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to view your posts');
                setLoading(false);
                return;
            }

            console.log('Token:', token);

            let userNumber = '';
            try {
                const decodedToken = jwtDecode(token);
                console.log('Decoded Token:', decodedToken);
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
        };

        fetchPosts();
    }, []);

    // Handle edit button click
    const handleEditClick = (blogId) => {
        navigate(`/edit-blog/${blogId}`);
    };

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

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
                            <Typography variant="h6" mb={1}>
                                {post.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" mb={2}>
                                Published: {new Date(post.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" mb={2}>
                                {post.description}
                            </Typography>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                color="primary"
                                onClick={() => handleEditClick(post.blogId)}
                            >
                                Edit
                            </Button>
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