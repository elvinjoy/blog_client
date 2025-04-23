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
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DEV_URL from '../Constants/Constants';

const EditBlogs = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogAndCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('You must be logged in!');
                    navigate('/login');
                    return;
                }

                const [blogRes, catRes] = await Promise.all([
                    fetch(`${DEV_URL}/blog/blogs/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${DEV_URL}/users/categories`)
                ]);

                if (!blogRes.ok || !catRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const blogData = await blogRes.json();
                const catData = await catRes.json();

                const blog = blogData.blog || blogData;

                setTitle(blog.title || '');
                setDescription(blog.description || '');
                setCategory(blog.category || '');
                setCategories(catData.categories || []);

                if (Array.isArray(blog.images)) {
                    setExistingImages(blog.images);
                } else if (blog.images) {
                    setExistingImages([blog.images].flat());
                }
            } catch (error) {
                toast.error('Failed to load blog data');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogAndCategories();
    }, [id, navigate]);

    const handleSubmit = async () => {
        if (!title || !description || !category) {
            toast.error('Please fill all fields');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You must be logged in!');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);

        images.forEach(img => formData.append('images', img));
        existingImages.forEach(imgUrl => formData.append('existingImages', imgUrl));

        try {
            const response = await fetch(`${DEV_URL}/blog/blogs/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                toast.success('Blog updated successfully!');
                navigate('/all-posts');
            } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message}`);
            }
        } catch (error) {
            toast.error('Network error occurred.');
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You must be logged in!');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${DEV_URL}/blog/blogs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Blog deleted successfully!');
                navigate('/all-posts');
            } else {
                const errorData = await response.json();
                toast.error(`Error deleting blog: ${errorData.message}`);
            }
        } catch (error) {
            toast.error('Network error occurred.');
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 2 || images.length + files.length > 2) {
            toast.error('You can upload a maximum of 2 images.');
            return;
        }

        setImages(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    };

    const handleRemoveNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return <Typography align="center">Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: '0 auto', padding: 3 }}>
            <Typography variant="h6">Edit the Existing Blog</Typography>

            <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />

            <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat.name}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box component="label" htmlFor="image-upload" sx={{
                border: '2px dashed gray',
                borderRadius: 2,
                padding: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f0f0f0' },
            }}>
                <AddPhotoAlternateIcon sx={{ fontSize: 48 }} />
                <Typography variant="body2" mt={1}>
                    Click to upload up to 2 new images
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

            {/* Existing Images */}
            {existingImages.length > 0 && (
                <ImageList rowHeight={100} cols={2}>
                    {existingImages.map((imgUrl, index) => (
                        <ImageListItem key={imgUrl} sx={{ position: 'relative' }}>
                            <img src={imgUrl} alt={`existing-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <Button
                                onClick={() => handleRemoveExistingImage(index)}
                                sx={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    minWidth: 0,
                                    padding: 0.5,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </Button>
                        </ImageListItem>
                    ))}
                </ImageList>
            )}

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
                <ImageList rowHeight={100} cols={2}>
                    {imagePreviews.map((preview, index) => (
                        <ImageListItem key={preview} sx={{ position: 'relative' }}>
                            <img src={preview} alt={`preview-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <Button
                                onClick={() => handleRemoveNewImage(index)}
                                sx={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    minWidth: 0,
                                    padding: 0.5,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </Button>
                        </ImageListItem>
                    ))}
                </ImageList>
            )}

            <Button variant="contained" onClick={handleSubmit}>
                Update Blog
            </Button>

            <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
            >
                Delete Blog
            </Button>
        </Box>
    );
};

export default EditBlogs;
