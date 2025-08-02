"use client"

import React, { useState } from "react"
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    alpha,
    Badge,
    Tooltip,
} from "@mui/material"
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    AccountBalance as AccountBalanceIcon,
    // Category as CategoryIcon,
    Receipt as ReceiptIcon,
    // TrendingUp as TrendingUpIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Brightness4,
    Brightness7,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from "@mui/icons-material"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useThemeContext } from "../context/ThemeContext"
import { useUser } from "../context/UserContext"

const navigationItems = [
    {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/dashboard/reports",
    },
    {
        text: "Expenses",
        icon: <ReceiptIcon />,
        path: "/dashboard/expenses",
    },
    {
        text: "Settings",
        icon: <SettingsIcon />,
        path: "/dashboard/settings",
    },
]

const DashboardLayout: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const theme = useTheme()
    const { mode, toggleColorMode } = useThemeContext()
    const { user, logoutUser } = useUser()
    const logout = logoutUser
    const navigate = useNavigate()
    const location = useLocation()

    const [mobileOpen, setMobileOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null)
    const [notifications, setNotifications] = useState<any[]>([])
    const [loadingNotifications, setLoadingNotifications] = useState(false)

    const drawerWidth = sidebarCollapsed ? 80 : 280

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleProfileMenuClose = () => {
        setAnchorEl(null)
    }

    const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchor(event.currentTarget)
    }

    // Add state for notification refresh
    const [notificationRefreshTrigger, setNotificationRefreshTrigger] = useState(0)

    // Function to refresh notifications (can be called from other components)
    const refreshNotifications = React.useCallback(() => {
        setNotificationRefreshTrigger((prev) => prev + 1)
    }, [])

    // Expose refresh function globally (you can use context or window object)
    React.useEffect(() => {
        window.refreshNotifications = refreshNotifications
        return () => {
            delete window.refreshNotifications
        }
    }, [refreshNotifications])

    // Fetch notifications from /api/notifications on page load and when triggered
    React.useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("/api/notifications", { method: "GET" })
                const data = await res.json()
                if (Array.isArray(data)) {
                    setNotifications(data)
                } else if (data && Array.isArray(data.notifications)) {
                    setNotifications(data.notifications)
                } else {
                    setNotifications([])
                }
            } catch {
                setNotifications([])
            }
        }
        fetchNotifications()
    }, [notificationRefreshTrigger]) // Add dependency on refresh trigger

    // Add periodic notification checking (every 30 seconds)
    React.useEffect(() => {
        const interval = setInterval(() => {
            refreshNotifications()
        }, 30000) // Check every 30 seconds

        return () => clearInterval(interval)
    }, [refreshNotifications])

    // Fetch notifications again when menu is opened (for refresh)
    React.useEffect(() => {
        if (notificationAnchor) {
            const fetchNotifications = async () => {
                setLoadingNotifications(true)
                try {
                    const res = await fetch("/api/notifications", { method: "GET" })
                    const data = await res.json()
                    if (Array.isArray(data)) {
                        setNotifications(data)
                    } else if (data && Array.isArray(data.notifications)) {
                        setNotifications(data.notifications)
                    } else {
                        setNotifications([])
                    }
                } catch {
                    setNotifications([])
                } finally {
                    setLoadingNotifications(false)
                }
            }
            fetchNotifications()
        }
    }, [notificationAnchor])

    const handleNotificationClose = async () => {
        setNotificationAnchor(null)
        // Mark all notifications as read
        try {
            await fetch("/api/notifications/mark-all-as-read", { method: "POST" })
            // Update notifications state to set all as read
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        } catch {
            // Ignore errors for now
        }
    }

    // Example logout handler (implement logout logic as needed)
    const handleLogout = async () => {
        handleProfileMenuClose()
        await logout()
    }

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user) return "U"
        const firstInitial = user.firstname && user.firstname.length > 0 ? user.firstname[0] : ""
        const lastInitial = user.lastname && user.lastname.length > 0 ? user.lastname[0] : ""
        if (firstInitial || lastInitial) {
            return `${firstInitial}${lastInitial}`.toUpperCase()
        }
        if (user.email && user.email.length > 0) {
            return user.email[0].toUpperCase()
        }
        return "U"
    }

    const drawer = (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                backdropFilter: "blur(20px)",
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Logo Section */}
            <Box
                sx={{
                    p: sidebarCollapsed ? 2 : 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: sidebarCollapsed ? "center" : "flex-start",
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    minHeight: 80,
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        width: sidebarCollapsed ? 40 : 48,
                        height: sidebarCollapsed ? 40 : 48,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: sidebarCollapsed ? 0 : 2,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    <AccountBalanceIcon sx={{ fontSize: sidebarCollapsed ? 24 : 28, color: "white" }} />
                </Box>
                {!sidebarCollapsed && (
                    <Box sx={{ opacity: sidebarCollapsed ? 0 : 1, transition: "opacity 0.3s ease-in-out" }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            BudgetTracker
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>
                            Smart Financial Management
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Scrollable Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: alpha(theme.palette.divider, 0.1),
                        borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: alpha(theme.palette.success.main, 0.3),
                        borderRadius: "3px",
                        "&:hover": {
                            background: alpha(theme.palette.success.main, 0.5),
                        },
                    },
                    scrollbarWidth: "thin",
                    scrollbarColor: `${alpha(theme.palette.success.main, 0.3)} ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                {/* Navigation */}
                <List sx={{ px: sidebarCollapsed ? 1 : 2, pt: 2 }}>
                    {navigationItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <Tooltip
                                title={sidebarCollapsed ? item.text : ""}
                                placement="right"
                                arrow
                                componentsProps={{
                                    tooltip: {
                                        sx: {
                                            backgroundColor: alpha(theme.palette.background.paper, 0.95),
                                            color: theme.palette.text.primary,
                                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                            backdropFilter: "blur(10px)",
                                            fontSize: "0.8rem",
                                        },
                                    },
                                    arrow: {
                                        sx: {
                                            color: alpha(theme.palette.background.paper, 0.95),
                                        },
                                    },
                                }}
                            >
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor:
                                            location.pathname === item.path ? alpha(theme.palette.success.main, 0.1) : "transparent",
                                        color: location.pathname === item.path ? theme.palette.success.main : theme.palette.text.primary,
                                        "&:hover": {
                                            backgroundColor: alpha(theme.palette.success.main, 0.08),
                                        },
                                        transition: "all 0.2s ease-in-out",
                                        justifyContent: sidebarCollapsed ? "center" : "flex-start",
                                        px: sidebarCollapsed ? 2 : 2,
                                        py: 1.5,
                                        minHeight: 48,
                                        width: "100%",
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color:
                                                location.pathname === item.path ? theme.palette.success.main : theme.palette.text.secondary,
                                            minWidth: sidebarCollapsed ? "auto" : 40,
                                            justifyContent: "center",
                                            mr: sidebarCollapsed ? 0 : 1,
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    {!sidebarCollapsed && (
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontSize: "0.9rem",
                                                fontWeight: location.pathname === item.path ? 600 : 400,
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Sidebar Toggle Button */}
            <Box
                sx={{
                    p: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    display: { xs: "none", md: "flex" },
                    justifyContent: sidebarCollapsed ? "center" : "flex-end",
                }}
            >
                <Tooltip
                    title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    placement="right"
                    arrow
                    componentsProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                                color: theme.palette.text.primary,
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                backdropFilter: "blur(10px)",
                                fontSize: "0.8rem",
                            },
                        },
                        arrow: {
                            sx: {
                                color: alpha(theme.palette.background.paper, 0.95),
                            },
                        },
                    }}
                >
                    <IconButton
                        onClick={handleSidebarToggle}
                        sx={{
                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            "&:hover": {
                                backgroundColor: alpha(theme.palette.success.main, 0.2),
                                transform: "scale(1.05)",
                            },
                            transition: "all 0.2s ease-in-out",
                            width: 40,
                            height: 40,
                        }}
                    >
                        {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: "blur(20px)",
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    color: theme.palette.text.primary,
                    transition: "all 0.3s ease-in-out",
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        Dashboard
                    </Typography>

                    {/* Header Actions */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* Theme Toggle */}
                        <IconButton
                            onClick={toggleColorMode}
                            sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>

                        {/* Notifications */}
                        <IconButton
                            onClick={handleNotificationOpen}
                            sx={{
                                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                color: theme.palette.warning.main,
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.warning.main, 0.2),
                                },
                            }}
                        >
                            <Badge badgeContent={notifications.filter((n) => !n.is_read).length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        {/* Profile */}
                        <IconButton sx={{ p: 0, ml: 1 }} onClick={handleProfileMenuOpen}>
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: theme.palette.success.main,
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                }}
                                src={user?.avatar}
                            >
                                {getUserInitials()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleProfileMenuClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: "visible",
                                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                    mt: 1.5,
                                    backgroundColor: alpha(theme.palette.background.paper, 0.95),
                                    backdropFilter: "blur(20px)",
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    minWidth: 180,
                                },
                            }}
                        >
                            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {user?.firstname || user?.email || "User"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user?.email}
                                </Typography>
                            </Box>
                            {/* Add profile actions here, e.g. settings, logout */}
                            {/* <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem> */}
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Notification Menu */}
            <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleNotificationClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        backgroundColor: alpha(theme.palette.background.paper, 0.95),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        minWidth: 340,
                        maxWidth: 400,
                        maxHeight: 700,
                    },
                }}
            >
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Notifications
                    </Typography>
                </Box>
                {loadingNotifications ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                        <Typography variant="body2">Loading...</Typography>
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            No notifications
                        </Typography>
                    </Box>
                ) : (
                    <List
                        disablePadding
                        sx={{
                            minWidth: 320,
                            maxWidth: 400,
                            maxHeight: 480,
                            overflowY: "auto",
                            // Custom scrollbar styles
                            "&::-webkit-scrollbar": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: alpha(theme.palette.divider, 0.1),
                                borderRadius: "3px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: alpha(theme.palette.primary.main, 0.25),
                                borderRadius: "3px",
                                "&:hover": {
                                    background: alpha(theme.palette.primary.main, 0.4),
                                },
                            },
                            scrollbarWidth: "thin",
                            scrollbarColor: `${alpha(theme.palette.primary.main, 0.25)} ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                    >
                        {[...notifications]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 10)
                            .map((notif) => (
                                <ListItem
                                    key={notif.id}
                                    alignItems="flex-start"
                                    component={ListItemButton}
                                    onClick={handleNotificationClose}
                                    sx={{
                                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.07)}`,
                                        "&:hover": {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.13),
                                        },
                                        py: 1.5,
                                        px: 2,
                                    }}
                                >
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                            {notif.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                                            {notif.detail}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: theme.palette.text.disabled, display: "block", mt: 0.5 }}
                                        >
                                            {notif.date}
                                        </Typography>
                                    </Box>
                                    {!notif.is_read && (
                                        <Box sx={{ ml: 2, mt: 0.5 }}>
                                            <Badge color="error" variant="dot" />
                                        </Box>
                                    )}
                                </ListItem>
                            ))}
                    </List>
                )}
            </Menu>

            {/* Drawer */}
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: 280, // Always full width on mobile
                            border: "none",
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            border: "none",
                            transition: "width 0.3s ease-in-out",
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: "100vh",
                    background:
                        theme.palette.mode === "light"
                            ? `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.05)} 0%, ${alpha(theme.palette.background.default, 0.95)} 30%, ${alpha(theme.palette.primary.light, 0.05)} 70%, ${alpha(theme.palette.secondary.light, 0.03)} 100%)`
                            : `linear-gradient(135deg, ${alpha(theme.palette.success.dark, 0.1)} 0%, ${theme.palette.background.default} 30%, ${alpha(theme.palette.primary.dark, 0.1)} 70%, ${alpha(theme.palette.secondary.dark, 0.05)} 100%)`,
                    transition: "all 0.3s ease-in-out",
                }}
            >
                <Toolbar />
                <Box sx={{ p: 1 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardLayout
