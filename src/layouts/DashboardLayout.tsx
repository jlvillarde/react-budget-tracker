"use client"

import type React from "react"
import { useState } from "react"
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
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
    AccountCircle,
    Logout,
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

    const handleNotificationClose = () => {
        setNotificationAnchor(null)
    }

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
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        {/* Profile */}
                        <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 1 }}>
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
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleProfileMenuClose}>
                    <Avatar sx={{ backgroundColor: theme.palette.success.main }} src={user?.avatar}>
                        {getUserInitials()}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user ? `${user.firstname} ${user.lastname}` : "User"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            {user?.email || "user@example.com"}
                        </Typography>
                    </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => navigate("/dashboard/settings")}>
                    <ListItemIcon>
                        <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={() => navigate("/dashboard/settings")}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

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
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        minWidth: 300,
                    },
                }}
            >
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Notifications
                    </Typography>
                </Box>
                <MenuItem onClick={handleNotificationClose}>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Budget Alert
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            You've exceeded your dining budget by ₱30
                        </Typography>
                    </Box>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            New Transaction
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            ₱45.99 spent at Grocery Store
                        </Typography>
                    </Box>
                </MenuItem>
                <MenuItem onClick={handleNotificationClose}>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Monthly Report
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Your monthly budget report is ready
                        </Typography>
                    </Box>
                </MenuItem>
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
                <Box sx={{ p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardLayout
