import React, { useState } from 'react';
import { TextField, Button, Paper } from '@mui/material'
import http from '../../utils/http';

function NewPost() {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("content", content);
        if (image) {
            formData.append("image", image);
        }
        try {
            await http.post("/post", formData);
            setContent("");
            setImage(null);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <Paper style={{ padding: "16px", marginBottom: "16px" }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="What's on your mind?"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    variant='outlined'
                />
                <input type='file' onChange={(e) => setImage(e.target.files[0])}
                    accept='image/*' style={{ margin: "16px 0" }} />
                <Button type='submit' variant='contained' color='primary'>
                    Post
                </Button>
            </form>
        </Paper>
    )
}

export default NewPost