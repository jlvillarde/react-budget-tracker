"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  // Divider,
  Link,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Stack,
  Grid,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material"
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  // Google as GoogleIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

const SignUp: React.FC = () => {

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedTerms) {
      setError("Please accept the terms and conditions")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        alert(`Sign Up: ${formData.email}`)
      }
    } catch (err) {
      setError("Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // const handleGoogleSignUp = () => {
  //   // Google sign up logic
  //   alert("Google Sign Up clicked")
  // }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: 480, md: 1100 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
      }}
    >
      {/* Main Container */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(20px)",
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.1)}`,
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          },
        }}
      >
        <Grid
          container
          spacing={0}
          direction="row"
          sx={{
            minHeight: { xs: "auto", md: "700px" },
            width: "100%",
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {/* Left Section - Header/Branding */}
          <Grid size={{ xs: 12, md: 5 }}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 3, md: 6 },
              textAlign: "center",
              position: "relative",
              minHeight: { xs: "200px", md: "700px" },
              flex: { xs: "1 1 100%", md: "1 1 41.666667%" }, // Explicit flex for 5/12 width
              maxWidth: { xs: "100%", md: "41.666667%" },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: isMobile
                  ? "none"
                  : `radial-gradient(circle at center, ${alpha(theme.palette.success.main, 0.15)} 0%, transparent 70%)`,
                pointerEvents: "none",
              },
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                width: { xs: 50, md: 100 },
                height: { xs: 50, md: 100 },
                borderRadius: { xs: 2, md: 4 },
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: { xs: 1.5, md: 4 },
                boxShadow: `0 12px 40px ${alpha(theme.palette.success.main, 0.4)}`,
                animation: !isMobile ? "pulse 3s ease-in-out infinite alternate" : "none",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(1)",
                    boxShadow: `0 12px 40px ${alpha(theme.palette.success.main, 0.4)}`,
                  },
                  "100%": {
                    transform: "scale(1.05)",
                    boxShadow: `0 16px 50px ${alpha(theme.palette.success.main, 0.5)}`,
                  },
                },
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: { xs: 24, md: 50 }, color: "white" }} />
            </Box>

            {/* Welcome Text */}
            <Typography
              variant={isMobile ? "h6" : "h3"}
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
                mb: { xs: 1, md: 3 },
              }}
            >
              Join BudgetTracker
            </Typography>

            <Typography
              variant={isMobile ? "body2" : "h5"}
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 400,
                mb: { xs: 1, md: 2 },
                fontSize: { xs: "0.875rem", md: "1.5rem" },
              }}
            >
              Start your financial journey
            </Typography>

            {!isMobile && (
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  opacity: 0.8,
                  maxWidth: "320px",
                  lineHeight: 1.6,
                  fontSize: "1.1rem",
                }}
              >
                Create your account and take control of your finances with our powerful budgeting tools
              </Typography>
            )}

            {/* Decorative Elements for Desktop */}
            {!isMobile && (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    top: "20%",
                    right: "10%",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    filter: "blur(25px)",
                    animation: "float 4s ease-in-out infinite",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-15px)" },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "25%",
                    left: "15%",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: `linear-gradient(45deg, ${alpha(theme.palette.warning.main, 0.2)}, ${alpha(theme.palette.success.main, 0.1)})`,
                    filter: "blur(20px)",
                    animation: "float 6s ease-in-out infinite reverse",
                  }}
                />
              </>
            )}
          </Grid>

          {/* Right Section - Form */}
          <Grid size={{ xs: 12, md: 7 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 3, md: 6 },
              minHeight: { xs: "auto", md: "700px" },
              flex: { xs: "1 1 100%", md: "1 1 58.333333%" }, // Explicit flex for 7/12 width
              maxWidth: { xs: "100%", md: "58.333333%" },
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "450px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Error Alert */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 4,
                    width: "100%",
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    fontSize: "1rem",
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                <Stack spacing={3.5} sx={{ width: "100%" }}>
                  {/* Name Fields Row */}
                  <Box display="flex" gap={2}>
                    <TextField
                      label="First Name"
                      fullWidth
                      value={formData.firstname}
                      onChange={handleChange("firstname")}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: alpha(theme.palette.background.paper, 0.5),
                          fontSize: "1rem",
                          height: "48px",
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          },
                          "&.Mui-focused": {
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.success.main,
                              borderWidth: 2,
                            },
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "1rem",
                          "&.Mui-focused": {
                            color: theme.palette.success.main,
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Last Name"
                      fullWidth
                      value={formData.lastname}
                      onChange={handleChange("lastname")}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: alpha(theme.palette.background.paper, 0.5),
                          fontSize: "1rem",
                          height: "48px",
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          },
                          "&.Mui-focused": {
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.success.main,
                              borderWidth: 2,
                            },
                          },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "1rem",
                          "&.Mui-focused": {
                            color: theme.palette.success.main,
                          },
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange("email")}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        fontSize: "1rem",
                        height: "48px",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                        "&.Mui-focused": {
                          backgroundColor: alpha(theme.palette.background.paper, 0.9),
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.success.main,
                            borderWidth: 2,
                          },
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "1rem",
                        "&.Mui-focused": {
                          color: theme.palette.success.main,
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={formData.password}
                    onChange={handleChange("password")}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? (
                              <VisibilityOff sx={{ fontSize: 20 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        fontSize: "1rem",
                        height: "48px",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                        "&.Mui-focused": {
                          backgroundColor: alpha(theme.palette.background.paper, 0.9),
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.success.main,
                            borderWidth: 2,
                          },
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "1rem",
                        "&.Mui-focused": {
                          color: theme.palette.success.main,
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            {showConfirmPassword ? (
                              <VisibilityOff sx={{ fontSize: 20 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        fontSize: "1rem",
                        height: "48px",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                        "&.Mui-focused": {
                          backgroundColor: alpha(theme.palette.background.paper, 0.9),
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.success.main,
                            borderWidth: 2,
                          },
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "1rem",
                        "&.Mui-focused": {
                          color: theme.palette.success.main,
                        },
                      },
                    }}
                  />

                  {/* Terms and Conditions */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        sx={{
                          color: theme.palette.success.main,
                          "&.Mui-checked": {
                            color: theme.palette.success.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: "1rem" }}>
                        I agree to the{" "}
                        <Link
                          href="#"
                          sx={{
                            color: theme.palette.success.main,
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="#"
                          sx={{
                            color: theme.palette.success.main,
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                    sx={{ mt: 1, mb: 1 }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: "none",
                      backgroundColor: theme.palette.success.main,
                      boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.3)}`,
                      "&:hover": {
                        backgroundColor: theme.palette.success.dark,
                        transform: "translateY(-2px)",
                        boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.4)}`,
                      },
                      "&:disabled": {
                        backgroundColor: alpha(theme.palette.success.main, 0.6),
                      },
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Create Budget Account"}
                  </Button>

                  {/* <Divider
                    sx={{
                      "&::before, &::after": {
                        borderColor: alpha(theme.palette.divider, 0.3),
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        px: 3,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        borderRadius: 1,
                        fontSize: "1rem",
                      }}
                    >
                      OR
                    </Typography>
                  </Divider> */}

                  {/* <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleGoogleSignUp}
                    startIcon={<GoogleIcon sx={{ fontSize: 20 }} />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      borderColor: alpha(theme.palette.divider, 0.3),
                      color: theme.palette.text.primary,
                      backgroundColor: alpha(theme.palette.background.paper, 0.3),
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        transform: "translateY(-1px)",
                        boxShadow: `0 6px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    Continue with Google
                  </Button> */}
                </Stack>
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                  pt: 3,
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  width: "100%",
                }}
              >
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: "1rem" }}>
                  Already have an account?{" "}
                  <Link
                    component="button"
                    variant="body1"
                    onClick={() => navigate("/signin")}
                    sx={{
                      color: theme.palette.success.main,
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "1rem",
                      "&:hover": {
                        textDecoration: "underline",
                        color: theme.palette.success.dark,
                      },
                      transition: "color 0.2s ease-in-out",
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default SignUp
