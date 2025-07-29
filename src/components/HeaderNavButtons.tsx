"use client"

import { Button, Stack, useTheme, alpha, useMediaQuery } from "@mui/material"
import { Login, PersonAdd, Dashboard } from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"
import { useUser } from "../context/UserContext" // adjust path if needed

export default function HeaderNavButtons() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const isSignInPage = location.pathname === "/signin"
  const isSignUpPage = location.pathname === "/signup"

  const sharedStyles = {
    px: { xs: 1, sm: 2, md: 3 },
    py: { xs: 0.5, sm: 1 },
    fontWeight: 600,
    textTransform: "none",
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    minWidth: { xs: 'auto', sm: 'auto' },
    whiteSpace: 'nowrap',
  }

  return (
    <Stack
      direction="row"
      spacing={{ xs: 0.5, sm: 1 }}
      alignItems="center"
      sx={{ flexShrink: 0 }}
    >
      {user ? (
        <Button
          variant="outlined"
          startIcon={!isMobile ? <Dashboard /> : undefined}
          onClick={() => navigate("/dashboard/reports")}
          size={isMobile ? "small" : "medium"}
          sx={{
            // backgroundColor: theme.palette.primary.main,
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            // outline: theme.palette.success.dark,
            // color: theme.palette.primary.contrastText,
            color: "white",
            "&:hover": {
              // backgroundColor: theme.palette.primary.dark,
              transform: "translateY(-1px)",
              // boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
            // boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: "all 0.3s ease-in-out",
            ...sharedStyles,
          }}
        >
          Go to Dashboard
        </Button>
      ) : (
        <>
          {!isSignInPage && (
            <Button
              variant={isSignUpPage ? "outlined" : "text"}
              startIcon={!isMobile ? <Login /> : undefined}
              onClick={() => navigate("/signin")}
              size={isMobile ? "small" : "medium"}
              sx={{
                color: theme.palette.text.primary,
                borderColor: alpha(theme.palette.text.secondary, 0.3),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                },
                ...sharedStyles,
              }}
            >
              Sign In
            </Button>
          )}

          {!isSignUpPage && (
            <Button
              variant="contained"
              startIcon={!isMobile ? <PersonAdd /> : undefined}
              onClick={() => navigate("/signup")}
              size={isMobile ? "small" : "medium"}
              sx={{
                backgroundColor: theme.palette.success.main,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 16px ${alpha(theme.palette.success.main, 0.4)}`,
                },
                boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                transition: "all 0.3s ease-in-out",
                ...sharedStyles,
              }}
            >
              Sign Up
            </Button>
          )}
        </>
      )}
    </Stack>
  )
}
