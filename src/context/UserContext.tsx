"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

interface User {
    id: number
    email: string
    firstname: string
    lastname: string
    avatar?: string
}

interface UserContextType {
    user: User | null
    loading: boolean
    login: (userData: User) => void
    logoutUser: () => Promise<boolean>  // Renamed to avoid confusion
    updateUser: (userData: Partial<User>) => void
    checkAuth: () => Promise<boolean>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Check if user is authenticated
    const checkAuth = async (): Promise<boolean> => {
        try {
            const response = await fetch("/api/user/me", {
                credentials: "include",
            })

            if (response.ok) {
                const userData = await response.json()
                setUser(userData)
                return true
            } else {
                setUser(null)
                return false
            }
        } catch (error) {
            console.error("Auth check failed:", error)
            setUser(null)
            return false
        } finally {
            setLoading(false)
        }
    }

    // Login function
    const login = (userData: User) => {
        setUser(userData)
    }

    // Logout function - only handles API call and state clearing
    const logoutUser = async (): Promise<boolean> => {
        try {
            setLoading(true)
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            })

            if (response.ok) {
                setUser(null)
                return true // Return success, let component handle navigation
            } else {
                console.error("Logout failed")
                return false
            }
        } catch (error) {
            console.error("Logout error:", error)
            return false
        } finally {
            setLoading(false)
        }
    }

    // Update user data
    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData })
        }
    }

    // Check authentication on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const value: UserContextType = {
        user,
        loading,
        login,
        logoutUser,
        updateUser,
        checkAuth,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Custom hook for logout with navigation - use this in components
export const useLogout = () => {
    const { logoutUser } = useUser()
    const navigate = useNavigate() // This works because it's used in components inside Router

    const logout = async () => {
        const success = await logoutUser()
        if (success) {
            navigate("/signin")
        }
    }

    return logout
}
