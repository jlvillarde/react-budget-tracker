import React from 'react';
import type { ReactNode } from 'react';
import {
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon,
} from '@mui/icons-material';

interface HeaderProps {
  children?: ReactNode;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ children, title = "My App" }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        borderRadius: 0,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          sx={{ 
            px: { xs: 0, sm: 2 },
            minHeight: { xs: 64, md: 72 },
            justifyContent: 'space-between'
          }}
        >
          {/* Logo/Brand Section */}
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                // background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                // border: '1px solid rgba(255,255,255,0.2)',
                // backdropFilter: 'blur(10px)'
              }}
            >
              <HomeIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                noWrap
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Modern Solutions
              </Typography>
            </Box>
          </Box>

          {/* Navigation Section */}
          <Box>
            {children}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 