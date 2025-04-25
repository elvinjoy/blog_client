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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DEV_URL from '../Constants/Constants';
import { toast } from 'react-toastify';

// Utility function to extract blog ID from URL
const extractBlogIdFromUrl = (url) => {
  const segments = url.split('/');
  return segments[segments.length - 1];
};

const Comments = () => {
  const params = useParams();
  const location = useLocation();
  const urlBlogId = extractBlogIdFromUrl(window.location.href);
  const blogId = params.blogId || urlBlogId;
  
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editingComment, setEditingComment] = useState(null); // State to hold the comment being edited
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

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
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to comment');
        return;
      }
      
      const response = await axios.post(
        `${DEV_URL}/comments/addcomment/${blogId}`,
        { 
          content: comment,
          blogId: blogId // Include blogId in the request body as required by backend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments([...comments, response.data]);
      setComment('');
      toast.success('Comment posted successfully');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment);
    setComment(comment.content); // Set the content of the comment into the input field
  };

  const handleEditSubmit = async () => {
    if (!comment.trim()) {
      toast.warning('Please enter a comment');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to edit comments');
        return;
      }
      
      const response = await axios.put(
        `${DEV_URL}/comments/update/${editingComment._id}`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the edited comment in the comments array
      setComments(
        comments.map(c => (c._id === editingComment._id ? { ...c, content: comment } : c))
      );
      setComment('');
      setEditingComment(null); // Reset editing state
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error(error.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;
    
    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to delete comments');
        return;
      }

      await axios.delete(`${DEV_URL}/comments/delete/${commentToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments(comments.filter(c => c._id !== commentToDelete._id));
      toast.success('Comment deleted successfully');
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete comment';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const canDeleteComment = (comment) => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || currentUser.userNumber === comment.userNumber;
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
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center">
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

                  <Box>
                    {canDeleteComment(comment) && (
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteClick(comment)}
                        aria-label="delete comment"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}

                    {canDeleteComment(comment) && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(comment)}
                        aria-label="edit comment"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
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
              label="Write a comment..."
              value={comment}
              onChange={handleCommentChange}
              disabled={submitting}
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              {editingComment ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Comment'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCommentSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </Button>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="secondary"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Comments;
