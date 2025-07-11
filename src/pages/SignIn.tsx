import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff,
  Google as GoogleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Sign In: ${email}`);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Google sign in logic
    alert('Google Sign In clicked');
  };

  return (
    <Box 
      maxWidth='lg'
      width="100%" 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="60vh"
      px={2}
    >
      <Paper 
        elevation={8} 
        sx={{ 
          p: { xs: 3, md: 4 }, 
          maxWidth: 450, 
          width: '100%', 
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            size="small"
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" fontSize='small' />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            size="small"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" fontSize='small' />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            disabled={loading}
            sx={{ 
              mb: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={handleGoogleSignIn}
            startIcon={<GoogleIcon />}
            sx={{ 
              mb: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              borderColor: 'grey.300',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'grey.400',
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)'
              }
            }}
          >
            Continue with Google
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                component="button"
                variant="body2"
                onClick={() => navigate('/signup')}
                sx={{ 
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignIn; 