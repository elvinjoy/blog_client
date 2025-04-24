import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Avatar,
} from '@mui/material';
import DEV_URL from '../Constants/Constants';
import { toast } from 'react-toastify';

// Utility function to extract blog ID from URL
const extractBlogIdFromUrl = (url) => {
  // Split the URL by '/' and get the last segment
  const segments = url.split('/');
  return segments[segments.length - 1];
};

const Comments = () => {
  // Get blogId from URL params using React Router's useParams
  const params = useParams();
  const location = useLocation();
  
  // Try to get blogId from params first, if not available, extract from URL
  const urlBlogId = extractBlogIdFromUrl(window.location.href);
  const blogId = params.blogId || urlBlogId;
  
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  
  useEffect(() => {
    if (blogId) {
      console.log("Using blog ID:", blogId);
      fetchComments();
      fetchBlogDetails();
    } else {
      console.error("Blog ID not found in URL");
      toast.error("Could not determine which blog to load comments for");
    }
  }, [blogId]);
  
  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`${DEV_URL}/blog/blogs/${blogId}`);
      setBlogTitle(response.data.blog.title || 'Blog Post');
    } catch (error) {
      console.error('Error fetching blog details:', error);
      toast.error("Failed to load blog details");
    }
  };
  
  const fetchComments = async () => {
    try {
      setLoading(true);
      // Updated endpoint to match backend structure
      const response = await axios.get(`${DEV_URL}/comments/${blogId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCommentChange = (e) => setComment(e.target.value);
  
  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast.warning('Please enter a comment');
      return;
    }
    
    if (!blogId) {
      toast.error('Blog ID is missing');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Get token and extract user info
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to comment');
        return;
      }
      
      // Updated endpoint to match backend structure and send blogId in the body
      const response = await axios.post(
        `${DEV_URL}/comments/addcomment/${blogId}`,
        { 
          content: comment,
          blogId: blogId // Include blogId in the request body as required by backend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update comments list with the new comment
      setComments([...comments, response.data]);
      setComment('');
      toast.success('Comment posted successfully');
      
      // Optionally refresh comments to ensure we have the latest data
      fetchComments();
      
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Comments {blogTitle ? `for "${blogTitle}"` : ''}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Box key={comment._id} mb={2} p={2} bgcolor="background.paper" borderRadius={1}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ mr: 1 }}>
                    {comment.username?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {comment.username || 'Anonymous'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1">{comment.content}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" my={2}>
              No comments yet. Be the first to comment!
            </Typography>
          )}

          <Box mt={3}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Write a comment..."
              value={comment}
              onChange={handleCommentChange}
              disabled={submitting}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
              disabled={submitting || !comment.trim()}
              sx={{ mt: 2 }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Post Comment'}
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default Comments;