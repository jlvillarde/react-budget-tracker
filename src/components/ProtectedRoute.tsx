"use client"

import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, CircularProgress, Typography, useTheme } from "@mui/material"
import { useUser } from "../context/UserContext"

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading, checkAuth } = useUser()
    const navigate = useNavigate()
    const theme = useTheme()

    useEffect(() => {
        const verifyAuth = async () => {
            if (!loading && !user) {
                const isAuthenticated = await checkAuth()
                if (!isAuthenticated) {
                    navigate("/signin", { replace: true })
                }
            }
        }

        verifyAuth()
    }, [user, loading, navigate, checkAuth])

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <CircularProgress
                    size={60}
                    sx={{
                        color: theme.palette.success.main,
                        mb: 2,
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                    }}
                >
                    Loading...
                </Typography>
            </Box>
        )
    }

    if (!user) {
        return null // Will redirect to signin
    }

    return <>{children}</>
}

export default ProtectedRoute
