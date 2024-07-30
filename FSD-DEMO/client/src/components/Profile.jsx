import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Paper, Typography, Avatar, Button } from "@mui/material"

function Profile() {
    const { user, logout } = useAuth();
    return (
        <Paper style={{ padding: "16px" }}>
            <Avatar src={user.profilePicture} style={{ width: 60, height: 60, marginBottom: "16px" }} />
            <Typography variant="h6">{user.username}</Typography>
            <Typography variant="body1">{user.email}</Typography>
            <Button onClick={logout} variant="contained" color="secondary"> Logout </Button>
        </Paper>
    )
}

export default Profile