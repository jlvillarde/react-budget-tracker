"use client"
import { Box, Typography, Button, Card, CardContent, Chip, Stack, useTheme, alpha, Grid } from "@mui/material"
import {
  TrendingUp,
  // LocalStorage,
  PhoneAndroid,
  SavingsOutlined,
  ArrowForward,
  Visibility,
  Shield,
  Code,
} from "@mui/icons-material"

export default function WelcomePage() {
  const theme = useTheme()

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      title: "Smart Analytics",
      description: "Get insights into your spending patterns with detailed analytics and reports.",
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
    },
    {
      icon: <Code sx={{ fontSize: 32 }} />,
      title: "Local Storage",
      description: "Your data stays on your device. Simple, fast, and keeps your information private.",
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
    },
    {
      icon: <PhoneAndroid sx={{ fontSize: 32 }} />,
      title: "Mobile Ready",
      description: "Track your expenses on the go with our responsive mobile interface.",
      color: theme.palette.secondary.main,
      bgColor: alpha(theme.palette.secondary.main, 0.1),
    },
    {
      icon: <SavingsOutlined sx={{ fontSize: 32 }} />,
      title: "Goal Setting",
      description: "Set savings goals and track your progress with visual indicators.",
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
    },
  ]

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px" }}>
      <Grid container spacing={6} alignItems="center" sx={{ minHeight: "70vh" }} py={2}>
        {/* Left Column - Hero Content */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Stack spacing={4}>
            {/* Badge */}
            <Box>
              <Chip
                icon={<SavingsOutlined />}
                label="Simple Budget Tracking"
                variant="outlined"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  borderColor: theme.palette.success.main,
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* Hero Title */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3.5rem", lg: "4rem" },
                lineHeight: 1.2,
                color: theme.palette.text.primary,
              }}
            >
              Take Control of Your{" "}
              <Typography
                // component="span"
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                }}
              >
                Financial Future
              </Typography>
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: "90%",
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.25rem" },
              }}
            >
              A simple yet powerful expense tracker to help you monitor spending, set budgets, and reach your financial goals.
            </Typography>

            {/* CTA Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: theme.palette.success.main,
                  "&:hover": {
                    backgroundColor: theme.palette.success.dark,
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.4)}`,
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Start Tracking
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Visibility />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderColor: theme.palette.text.secondary,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                Learn More
              </Button>
            </Stack>

            {/* Stats */}
            <Stack direction="row" spacing={4} sx={{ pt: 3 }}>
              {[
                { value: "Easy", label: "To Use" },
                { value: "Free", label: "Forever" },
                { value: "Secure", label: "& Private" },
              ].map((stat, index) => (
                <Box key={index} sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Grid>

        {/* Right Column - Feature Cards */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        backgroundColor: feature.bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.5 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Bottom Trust Indicators */}
      <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Shield sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Data stays on your device
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Simple and straightforward expense tracking
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            No registration required
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}