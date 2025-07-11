import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Stack,
  Chip,
  Paper
} from '@mui/material';
import { 
  Rocket as RocketIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Authentication',
      description: 'Advanced security with multi-factor authentication and encrypted data protection.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Lightning Fast',
      description: 'Optimized performance with modern technologies for the best user experience.'
    },
    {
      icon: <RocketIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Easy to Use',
      description: 'Intuitive interface designed for both beginners and advanced users.'
    }
  ];

  const benefits = [
    'Real-time data synchronization',
    'Cross-platform compatibility',
    '24/7 customer support',
    'Regular security updates',
    'Customizable dashboard',
    'Advanced analytics'
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box 
        textAlign="center" 
        sx={{
          margin: 10,
          mb: 8,
          background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(156,39,176,0.1) 100%)',
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          mx: 'auto',
        }}
      >
        <Chip 
          label="🚀 Now Available" 
          color="primary" 
          sx={{ mb: 3, fontWeight: 600 }}
        />
        
        <Typography 
          variant="h2" 
          fontWeight={700} 
          gutterBottom 
          color="text.primary"
          sx={{ 
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 2
          }}
        >
          Welcome to{' '}
          <Typography 
            component="span" 
            variant="h2" 
            fontWeight={700} 
            color="primary.main"
            sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            My App
          </Typography>
        </Typography>
        
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Experience the next generation of digital solutions with our cutting-edge platform. 
          Built with modern technologies and designed for the future.
        </Typography>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/signup')}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Get Started Free
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/signin')}
            sx={{ 
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Sign In
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Switch themes using the button in the header! 🌙
        </Typography>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          textAlign="center" 
          fontWeight={600} 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Us?
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' } }}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Benefits Section */}
      <Paper 
        elevation={1}
        sx={{ 
          p: { xs: 3, md: 6 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(156,39,176,0.05) 100%)'
        }}
      >
        <Typography 
          variant="h4" 
          textAlign="center" 
          fontWeight={600} 
          gutterBottom
          sx={{ mb: 4 }}
        >
          Everything You Need
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {benefits.map((benefit, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(33.333% - 16px)' } }}>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon color="primary" fontSize="small" />
                <Typography variant="body1">
                  {benefit}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* CTA Section */}
      <Box 
        textAlign="center" 
        sx={{ 
          mt: 8,
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(156,39,176,0.1) 100%)'
        }}
      >
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Join thousands of users who trust our platform
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/signup')}
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Create Your Account
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 