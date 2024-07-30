import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Typography } from '@mui/material';
import Post from './Post';
import http from '../../utils/http';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const { data } = await http.get('/post');
                setPosts(data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }
        getPosts();
    }, []);

    if (loading) {
        return <CircularProgress />
    }
    return (
        <Grid container spacing={2}>
            {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                    <Post post={post} />
                </Grid>
            ))}
        </Grid>
    )
}

export default Feed