import React, { useState, useEffect, useMemo } from 'react';
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
  CircularProgress
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DEV_URL from '../Constants/Constants';

const EditBlogsByAdmin = () => {
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
  const [submitting, setSubmitting] = useState(false);

  // Function to get the proper image URL from the server path
  const getImageUrl = useMemo(() => (imagePath) => {
    if (!imagePath) return null;
    
    // If the path already starts with http or https, it's an external URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Extract the base URL without '/api'
    const baseURL = DEV_URL.replace('/api', '');
    
    // Return the complete URL
    return `${baseURL}${imagePath}`;
  }, []);

  useEffect(() => {
    const fetchBlogAndCategories = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          toast.error('You must be logged in!');
          navigate('/adminlogin');
          return;
        }

        const [blogRes, catRes] = await Promise.all([
          fetch(`${DEV_URL}/blog/blogs/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          fetch(`${DEV_URL}/users/categories`),
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
        
        console.log('Existing images:', blog.images);
      } catch (error) {
        console.error('Error fetching blog data:', error);
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

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      toast.error('You must be logged in!');
      navigate('/adminlogin');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    // Add new images to FormData
    images.forEach((img) => formData.append('images', img));
    
    // Add existing image paths
    existingImages.forEach((imgUrl) => formData.append('existingImages', imgUrl));

    try {
      const response = await fetch(`${DEV_URL}/blog/blogs/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });

      if (response.ok) {
        toast.success('Blog updated successfully!');
        navigate('/admindashboard');
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || 'Failed to update blog'}`);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      toast.error('You must be logged in!');
      navigate('/adminlogin');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${DEV_URL}/blog/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (response.ok) {
        toast.success('Blog deleted successfully!');
        navigate('/admindashboard');
      } else {
        const errorData = await response.json();
        toast.error(`Error deleting blog: ${errorData.message || 'Failed to delete'}`);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Check if total number of images would exceed 2
    if (files.length > 2 || existingImages.length + images.length + files.length > 2) {
      toast.error('You can upload a maximum of 2 images.');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create object URLs for previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (index) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle image loading errors
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, margin: '0 auto', padding: 3 }}>
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
          Click to upload up to 2 images ({2 - existingImages.length - images.length} remaining)
        </Typography>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          hidden
          disabled={existingImages.length + images.length >= 2}
        />
      </Box>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <>
          <Typography variant="subtitle2">Current Images:</Typography>
          <ImageList sx={{ width: '100%', height: 'auto' }} cols={2} rowHeight={200}>
            {existingImages.map((imgPath, index) => (
              <ImageListItem key={`existing-${index}`} sx={{ position: 'relative' }}>
                <img 
                  src={getImageUrl(imgPath)} 
                  alt={`existing-${index}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={handleImageError}
                />
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
        </>
      )}

      {/* New Image Previews */}
      {imagePreviews.length > 0 && (
        <>
          <Typography variant="subtitle2">New Images to Upload:</Typography>
          <ImageList sx={{ width: '100%', height: 'auto' }} cols={2} rowHeight={200}>
            {imagePreviews.map((preview, index) => (
              <ImageListItem key={`preview-${index}`} sx={{ position: 'relative' }}>
                <img 
                  src={preview} 
                  alt={`preview-${index}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
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
        </>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={submitting}
          fullWidth
        >
          {submitting ? <CircularProgress size={24} /> : 'Update Blog'}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
          startIcon={<DeleteIcon />}
          disabled={submitting}
          fullWidth
        >
          Delete Blog
        </Button>
      </Box>
    </Box>
  );
};

export default EditBlogsByAdmin;