import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const Comments = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { username: 'Jane Doe', text: 'Great post!' },
    { username: 'John Smith', text: 'Very informative, thanks!' },
  ]);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, { username: 'You', text: comment }]);
      setComment('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 600, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 2 }}>
          {comments.map((comment, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                {comment.username}
              </Typography>
              <Typography variant="body1">{comment.text}</Typography>
            </Box>
          ))}
        </Box>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={handleCommentChange}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCommentSubmit}
        >
          Post Comment
        </Button>
      </Paper>
    </Box>
  );
};

export default Comments;
