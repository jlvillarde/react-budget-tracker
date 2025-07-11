import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeaderNavButtons: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        color="inherit"
        variant="outlined"
        size="small"
        sx={{ 
          ml: 2, 
          borderRadius: 2, 
          borderColor: 'white',
          color: 'white',
          outline: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: 'none'
          },
          '&:focus-visible': {
            outline: 'none'
          },
          '&.Mui-focusVisible': {
            outline: 'none'
          },
          '&:hover': {
            borderColor: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
        onClick={() => navigate('/signin')}
      >
        Sign In
      </Button>
      <Button
        color="inherit"
        variant="outlined"
        size="small"
        sx={{ 
          ml: 2, 
          borderRadius: 2, 
          borderColor: 'white',
          color: 'white',
          outline: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: 'none'
          },
          '&:focus-visible': {
            outline: 'none'
          },
          '&.Mui-focusVisible': {
            outline: 'none'
          },
          '&:hover': {
            borderColor: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
        onClick={() => navigate('/signup')}
      >
        Sign Up
      </Button>
    </>
  );
};

export default HeaderNavButtons; 