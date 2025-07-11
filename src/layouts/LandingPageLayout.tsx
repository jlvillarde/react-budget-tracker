import {
  Box, Container
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import ThemeToggleButton from '../components/ThemeToggleButton';
import HeaderNavButtons from '../components/HeaderNavButtons';
import Header from '../components/Header';

export default function LandingPageLayout() {
  return (
    <Box sx={{
      width: '100%', 
      minHeight: '100vh', 
      bgcolor: 'background.default', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Header>
        <ThemeToggleButton />
        <HeaderNavButtons />
      </Header>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 8,
          width: '100%'
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flex: 1
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
} 