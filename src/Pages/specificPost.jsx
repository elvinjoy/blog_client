import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DEV_URL from '../Constants/Constants';

const SpecificPost = () => {
    const { id } = useParams(); // extract blog ID from the URL
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${DEV_URL}/blog/blogs/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch blog');
                }
                const data = await response.json();
                setBlog(data.blog);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>{blog.title}</h1>
            <p><strong>Category:</strong> {blog.category}</p>
            <p><strong>Description:</strong> {blog.description}</p>
            <div>
                <strong>Images:</strong>
                {blog.images.map((img, index) => (
                    <img 
                        key={index} 
                        src={`http://localhost:4000${img}`} 
                        alt={`Blog Image ${index + 1}`} 
                        style={{ width: '200px', marginRight: '10px' }}
                    />
                ))}
            </div>
            <p><strong>Created By:</strong> {blog.createdBy}</p>
            <p><strong>Created At:</strong> {new Date(blog.createdAt).toLocaleString()}</p>
        </div>
    );
};

export default SpecificPost;
