"use client"

import { Box, Container, useTheme, alpha } from "@mui/material"
import { Outlet } from "react-router-dom"
import ThemeToggleButton from "../components/ThemeToggleButton"
import HeaderNavButtons from "../components/HeaderNavButtons"
import Header from "../components/Header"

export default function LandingPageLayout() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.08)} 0%, ${alpha(theme.palette.background.default, 0.95)} 30%, ${alpha(theme.palette.primary.light, 0.08)} 70%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.success.dark, 0.15)} 0%, ${theme.palette.background.default} 30%, ${alpha(theme.palette.primary.dark, 0.15)} 70%, ${alpha(theme.palette.secondary.dark, 0.1)} 100%)`,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            theme.palette.mode === "light"
              ? `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.success.light, 0.1)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%)`
              : `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.success.dark, 0.2)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha(theme.palette.primary.dark, 0.2)} 0%, transparent 50%)`,
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      {/* Header */}
      <Header>
        <HeaderNavButtons />
        <ThemeToggleButton />
      </Header>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pt: { xs: 8, md: 10 }, // Account for fixed header
          pb: 4,
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Content Container */}
        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 4, md: 6 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            position: "relative",
          }}
        >
          {/* Content */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: { xs: "60vh", md: "70vh" },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Outlet />
          </Box>
        </Container>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `linear-gradient(45deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
            filter: "blur(40px)",
            animation: "float 6s ease-in-out infinite",
            zIndex: 0,
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0px)",
              },
              "50%": {
                transform: "translateY(-20px)",
              },
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "8%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.1)})`,
            filter: "blur(30px)",
            animation: "float 8s ease-in-out infinite reverse",
            zIndex: 0,
          }}
        />
      </Box>

      {/* Bottom Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "20%",
          background: `linear-gradient(to top, ${alpha(theme.palette.background.default, 0.8)} 0%, transparent 100%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </Box>
  )
}
