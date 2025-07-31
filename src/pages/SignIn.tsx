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
  Link,
  Alert,
  CircularProgress,
  Stack,
  Grid,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material"
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { login } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for session
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        login(userData) // Update user context
        navigate("/dashboard/reports")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Invalid email or password")
      }
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: 400, md: 1000 }, // Smaller max width on mobile
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 1.5, md: 2 }, // Reduced padding on mobile
      }}
    >
      {/* Main Container */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(20px)",
          borderRadius: { xs: 1.5, md: 2 }, // Smaller border radius on mobile
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `0 ${isMobile ? '4px 16px' : '12px 40px'} ${alpha(theme.palette.common.black, isMobile ? 0.08 : 0.1)}`,
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: { xs: 2, md: 4 }, // Thinner top border on mobile
            background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
          },
        }}
      >
        <Grid
          container
          spacing={0}
          direction="row"
          sx={{
            minHeight: { xs: "auto", md: "600px" },
            width: "100%",
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {/* Left Section - Header/Branding */}
          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 1.5, md: 6 }, // Much smaller padding on mobile
              textAlign: "center",
              position: "relative",
              minHeight: { xs: "120px", md: "600px" }, // Reduced height on mobile
              flex: { xs: "1 1 100%", md: "1 1 41.666667%" },
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
                width: { xs: 28, md: 100 }, // Much smaller logo on mobile
                height: { xs: 28, md: 100 },
                borderRadius: { xs: 1, md: 4 },
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: { xs: 0.5, md: 4 }, // Reduced margin on mobile
                boxShadow: `0 ${isMobile ? '2px 8px' : '8px 24px'} ${alpha(theme.palette.success.main, 0.25)}`,
                animation: !isMobile ? "pulse 3s ease-in-out infinite alternate" : "none",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(1)",
                    boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.25)}`,
                  },
                  "100%": {
                    transform: "scale(1.05)",
                    boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.3)}`,
                  },
                },
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: { xs: 16, md: 50 }, color: "white" }} />
            </Box>

            {/* Welcome Text */}
            <Typography
              variant={isMobile ? "subtitle1" : "h3"}
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
                mb: { xs: 0.25, md: 3 }, // Reduced margin on mobile
                fontSize: { xs: "0.9rem", sm: "1.1rem", md: "3rem" }, // Smaller font on mobile
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant={isMobile ? "caption" : "h5"}
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 400,
                mb: { xs: 0, md: 2 },
                fontSize: { xs: "0.7rem", md: "1.5rem" }, // Much smaller font on mobile
              }}
            >
              Sign in to your budget tracker
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
                Continue managing your financial goals and track your expenses with ease
              </Typography>
            )}

            {/* Decorative Elements for Desktop Only */}
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
          <Grid
            size={{ xs: 12, md: 7 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 1.5, md: 6 }, // Much smaller padding on mobile
              minHeight: { xs: "auto", md: "600px" },
              flex: { xs: "1 1 100%", md: "1 1 58.333333%" },
              maxWidth: { xs: "100%", md: "58.333333%" },
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: 280, md: 400 }, // Smaller max width on mobile
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
                    mb: { xs: 2, md: 4 }, // Smaller margin on mobile
                    width: "100%",
                    borderRadius: 1.5,
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    fontSize: { xs: "0.8rem", md: "1rem" }, // Smaller font on mobile
                    "& .MuiAlert-icon": {
                      fontSize: { xs: "1rem", md: "1.2rem" }, // Smaller icon on mobile
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", pt: 3 }}>
                <Stack spacing={{ xs: 2.5, md: 4 }} sx={{ width: "100%" }}> {/* Reduced spacing on mobile */}
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: theme.palette.success.main, fontSize: { xs: 16, md: 20 } }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        fontSize: { xs: "0.85rem", md: "1rem" }, // Smaller font on mobile
                        height: { xs: "36px", md: "48px" }, // Smaller height on mobile
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
                        fontSize: { xs: "0.85rem", md: "1rem" }, // Smaller label on mobile
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: theme.palette.success.main, fontSize: { xs: 16, md: 20 } }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size={isMobile ? "small" : "medium"} // Smaller button on mobile
                          >
                            {showPassword ? (
                              <VisibilityOff sx={{ fontSize: { xs: 16, md: 20 } }} />
                            ) : (
                              <Visibility sx={{ fontSize: { xs: 16, md: 20 } }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        fontSize: { xs: "0.85rem", md: "1rem" }, // Smaller font on mobile
                        height: { xs: "36px", md: "48px" }, // Smaller height on mobile
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
                        fontSize: { xs: "0.85rem", md: "1rem" }, // Smaller label on mobile
                        "&.Mui-focused": {
                          color: theme.palette.success.main,
                        },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: { xs: 0.8, md: 1.5 }, // Smaller padding on mobile
                      fontSize: { xs: "0.9rem", md: "1.1rem" }, // Smaller font on mobile
                      fontWeight: 600,
                      borderRadius: 1.5,
                      textTransform: "none",
                      backgroundColor: theme.palette.success.main,
                      boxShadow: `0 ${isMobile ? '2px 8px' : '4px 12px'} ${alpha(theme.palette.success.main, 0.2)}`,
                      "&:hover": {
                        backgroundColor: theme.palette.success.dark,
                        transform: isMobile ? "none" : "translateY(-2px)",
                        boxShadow: `0 ${isMobile ? '3px 12px' : '6px 18px'} ${alpha(theme.palette.success.main, 0.3)}`,
                      },
                      "&:disabled": {
                        backgroundColor: alpha(theme.palette.success.main, 0.6),
                      },
                      transition: "all 0.3s ease-in-out",
                      minHeight: { xs: "36px", md: "48px" }, // Smaller button height on mobile
                    }}
                  >
                    {loading ? <CircularProgress size={isMobile ? 18 : 24} color="inherit" /> : "Sign In"}
                  </Button>
                </Stack>
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  textAlign: "center",
                  mt: { xs: 2, md: 5 }, // Smaller margin on mobile
                  pt: { xs: 1.5, md: 4 }, // Smaller padding on mobile
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: "0.8rem", md: "1rem" } // Smaller font on mobile
                  }}
                >
                  Don't have an account?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/signup")}
                    sx={{
                      color: theme.palette.success.main,
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: { xs: "0.8rem", md: "1rem" }, // Smaller font on mobile
                      "&:hover": {
                        textDecoration: "underline",
                        color: theme.palette.success.dark,
                      },
                      transition: "color 0.2s ease-in-out",
                    }}
                  >
                    Sign Up
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

export default SignIn