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
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            px: { xs: 1, sm: 2 },
            minHeight: { xs: 56, sm: 60, md: 64 },
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 2 }
          }}
        >
          {/* Logo/Brand Section */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              cursor: 'pointer',
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
              minWidth: 0 // Allow shrinking
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: { xs: 36, sm: 40, md: 44 },
                height: { xs: 36, sm: 40, md: 44 },
                borderRadius: { xs: 1.5, sm: 2 },
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: { xs: 1, sm: 1.5, md: 2 },
                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                transition: 'all 0.3s ease-in-out',
                flexShrink: 0,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.4)}`,
                }
              }}
            >
              <AccountBalanceIcon sx={{
                fontSize: { xs: 20, sm: 22, md: 24 },
                color: 'white'
              }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant={isSmall ? "subtitle1" : isMobile ? "h6" : "h5"}
                noWrap
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
                  lineHeight: 1.2
                }}
              >
                {isSmall ? "Budget" : title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'none', md: 'block' },
                  fontSize: '0.7rem',
                  lineHeight: 1
                }}
              >
                Smart Financial Management
              </Typography>
            </Box>
          </Box>

          {/* Navigation Section */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              gap: { xs: 0.5, sm: 1 },
              flexShrink: 0
            }}
          >
            {children}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;