import React from 'react';
import type { ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';

interface HeaderProps {
  children?: ReactNode;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ children, title = "BudgetTracker" }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            px: { xs: 0, sm: 2 },
            minHeight: { xs: 56, md: 64 },
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
                width: 44,
                height: 44,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.4)}`,
                }
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                noWrap
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' },
                  fontSize: '0.7rem'
                }}
              >
                Smart Financial Management
              </Typography>
            </Box>
          </Box>

          {/* Navigation Section */}
          <Box display="flex" alignItems="center" gap={1}>
            {children}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
