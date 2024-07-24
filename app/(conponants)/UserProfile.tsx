import React, { useState } from 'react';
import { Box, Avatar, Typography, IconButton, MenuItem, Menu } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { deleteCookie } from '../(lib)/nookies';

const UserProfile = ({ name }) => {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogoutClick = () => {
    deleteCookie();
    router.push('/login');
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1A2B53', // Adjust the background color as needed
        borderRadius: '20px',
        color: 'rgb(112, 112, 112)', // Text color
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Optional: Add shadow for depth
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          backgroundColor: '#fff', // Avatar background color
          color: 'rgb(112, 112, 112)', // Avatar icon color
        }}
      >
        <Typography sx={{ fontWeight: 'bold', fontSize: 13 }}>
          {name.charAt(0)}
        </Typography>
      </Avatar>
      <Typography
        sx={{ marginLeft: '8px',  color: '#fff', fontSize: 13 }}
      >
        {name}
      </Typography>
      <IconButton
        onClick={handleClick}
        sx={{
          marginLeft: '8px',
          padding: 0,
          color: '#fff',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <ArrowDropDown />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#1A2B53',
            color: '#fff',
          },
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserProfile;
