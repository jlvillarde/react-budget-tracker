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
  CircularProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Person as PersonIcon,
  Visibility, 
  VisibilityOff,
  Google as GoogleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Sign Up: ${formData.email}`);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Google sign up logic
    alert('Google Sign Up clicked');
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
          maxWidth: 500, 
          width: '100%', 
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join us and start your journey
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              size="small"
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={handleChange('firstName')}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={handleChange('lastName')}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TextField
            size="small"
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange('email')}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
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
            value={formData.password}
            onChange={handleChange('password')}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
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
            sx={{ mb: 2 }}
          />

          <TextField
            size="small"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                I agree to the{' '}
                <Link href="#" sx={{ textDecoration: 'none' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" sx={{ textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ mb: 2 }}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
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
            onClick={handleGoogleSignUp}
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
              Already have an account?{' '}
              <Link 
                component="button"
                variant="body2"
                onClick={() => navigate('/signin')}
                sx={{ 
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp; 