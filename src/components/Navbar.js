// src/components/Navbar.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { badges } from '../utils/userProgress'; // Import badges

function Navbar({ userData }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login', { replace: true });
        } catch (err) {
            console.error("Error signing out:", err);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/" color="inherit" sx={{ flexGrow: 1, textDecoration: 'none' }}>
                    CyberSafe Quiz
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountCircle sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {auth.currentUser?.email}
                    </Typography>
                    {/* Show "Beginner" until Cyber Warrior is earned */}
                    {userData && (
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {userData.badge === badges[0] && userData.difficulty === "Beginner"
                                ? "Beginner"
                                : userData.badge}
                        </Typography>
                    )}
                     {userData && (
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            { userData.scenarioBadge}
                        </Typography>
                    )}
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;