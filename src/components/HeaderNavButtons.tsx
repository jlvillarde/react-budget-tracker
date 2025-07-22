"use client"

import { Button, Stack, useTheme, alpha, useMediaQuery } from "@mui/material"
import { Login, PersonAdd } from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"

export default function HeaderNavButtons() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const isSignInPage = location.pathname === "/signin"
  const isSignUpPage = location.pathname === "/signup"

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {!isSignInPage && (
        <Button
          variant={isSignUpPage ? "outlined" : "text"}
          startIcon={!isMobile ? <Login /> : undefined}
          onClick={() => navigate("/signin")}
          sx={{
            color: theme.palette.text.primary,
            borderColor: alpha(theme.palette.text.secondary, 0.3),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            },
            px: { xs: 2, sm: 3 },
            py: 1,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          {isMobile ? "Sign In" : "Sign In"}
        </Button>
      )}

      {!isSignUpPage && (
        <Button
          variant="contained"
          startIcon={!isMobile ? <PersonAdd /> : undefined}
          onClick={() => navigate("/signup")}
          sx={{
            backgroundColor: theme.palette.success.main,
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.success.dark,
              transform: "translateY(-2px)",
              boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.4)}`,
            },
            px: { xs: 2, sm: 3 },
            py: 1,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
            transition: "all 0.3s ease-in-out",
          }}
        >
          {isMobile ? "Sign Up" : "Get Started"}
        </Button>
      )}
    </Stack>
  )
}
