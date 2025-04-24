import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DEV_URL from '../Constants/Constants';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null); // Category to delete

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const token = localStorage.getItem('adminToken'); // Ensure token is retrieved
        if (!token) {
            toast.error('No admin token found. Please log in again.');
            return;
        }
        try {
            const res = await axios.get(`${DEV_URL}/admin/get-categories`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in request header
                },
            });
            setCategories(res.data.categories || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setCategoryToDelete(id); // Set the category to delete
        setOpenDialog(true); // Open the dialog
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('adminToken'); // Retrieve the token from localStorage
        if (!token) {
            toast.error('No admin token found. Please log in again.');
            return;
        }

        try {
            await axios.delete(`${DEV_URL}/admin/delete-categories/${categoryToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Category deleted successfully');
            // Update the categories list after deletion
            setCategories(prevCategories => prevCategories.filter(category => category._id !== categoryToDelete));
            setOpenDialog(false); // Close the dialog
        } catch (err) {
            console.error('Error deleting category:', err);
            toast.error('Failed to delete category');
            setOpenDialog(false); // Close the dialog in case of error
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); // Close the dialog without deleting
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage Categories
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : categories.length === 0 ? (
                <Typography>No categories found.</Typography>
            ) : (
                <List>
                    {categories.map((category) => (
                        <ListItem key={category._id} divider>
                            <ListItemText
                                primary={category.name}
                                secondary={`Created At: ${new Date(category.createdAt).toLocaleString()}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(category._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this category?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </Box>
    );
};

export default ManageCategories;
