import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    ImageList,
    ImageListItem,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast
import DEV_URL from '../Constants/Constants'; // Your constant URL file

const CreateBlogForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch categories on page load
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${DEV_URL}/users/categories`);
                const data = await response.json();
                // Extract categories from the response object
                if (data.categories) {
                    setCategories(data.categories); // Use the categories directly
                } else {
                    console.error('Categories data is missing the expected structure');
                    setCategories([]); // Handle error
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]); // Handle error
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);
    const handleCategoryChange = (event) => setCategory(event.target.value);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 2 || images.length + files.length > 2) {
            toast.error('You can upload a maximum of 2 images.'); // Error toast for image limit
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title || !description || !category || images.length !== 2) {
            toast.error('Please fill in all fields and upload exactly 2 images.'); // Error toast for validation
            return;
        }

        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        if (!token) {
            toast.error('You must be logged in to create a blog!'); // Error toast for no token
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            const response = await fetch(`${DEV_URL}/blog/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Blog created successfully!'); // Success toast
                // Reset form
                setTitle('');
                setDescription('');
                setCategory('');
                setImages([]);
                setImagePreviews([]);
            } else {
                const errorData = await response.json();
                toast.error(`Error creating blog: ${errorData.message || 'Something went wrong'}`); // Error toast for failure
            }
        } catch (error) {
            console.error('Network error:', error);
            toast.error('Network error occurred while creating the blog.'); // Error toast for network issues
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: '0 auto',
                padding: 3,
            }}
        >
            <Typography variant="h6">Create New Blog</Typography>

            <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={handleTitleChange}
                required
            />
            <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
                required
            />

            {/* Category Dropdown */}
            <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    id="category"
                    value={category}
                    onChange={handleCategoryChange}
                    label="Category"
                    disabled={loadingCategories}
                >
                    {loadingCategories ? (
                        <MenuItem value="">Loading...</MenuItem>
                    ) : Array.isArray(categories) && categories.length > 0 ? (
                        categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat.name}>
                                {cat.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="" disabled>No categories available</MenuItem>
                    )}
                </Select>
            </FormControl>

            {/* Upload Box */}
            <Box
                component="label"
                htmlFor="image-upload"
                sx={{
                    border: '2px dashed gray',
                    borderRadius: 2,
                    padding: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#f0f0f0',
                    },
                }}
            >
                <AddPhotoAlternateIcon sx={{ fontSize: 48 }} />
                <Typography variant="body2" mt={1}>
                    Click to upload up to 2 images
                </Typography>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    hidden
                />
            </Box>

            {/* Previews */}
            {imagePreviews.length > 0 && (
                <ImageList rowHeight={100} cols={2}>
                    {imagePreviews.map((preview, index) => (
                        <ImageListItem key={preview} sx={{ position: 'relative' }}>
                            <img
                                src={preview}
                                alt={`preview-${index}`}
                                loading="lazy"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                            <Button
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    minWidth: 0,
                                    padding: 0.5,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    },
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </Button>
                        </ImageListItem>
                    ))}
                </ImageList>
            )}

            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={images.length !== 2}
            >
                Create Blog
            </Button>
        </Box>
    );
};

export default CreateBlogForm;
