"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Stack,
    useTheme,
    alpha,
    Grid,
    FormControlLabel,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from "@mui/material"
import {
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Palette as PaletteIcon,
    AttachMoney as AttachMoneyIcon,
    Category as CategoryIcon,
    Notifications as NotificationsIcon,
} from "@mui/icons-material"

interface UserSettings {
    currency: string
    language: string
    theme: string
    notifications: {
        email: boolean
        push: boolean
        budgetAlerts: boolean
    }
    budgetLimits: {
        daily: number
        weekly: number
        monthly: number
    }
    categories: string[]
}

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<UserSettings>({
        currency: "PHP",
        language: "en",
        theme: "system",
        notifications: {
            email: true,
            push: true,
            budgetAlerts: true,
        },
        budgetLimits: {
            daily: 1000,
            weekly: 5000,
            monthly: 20000,
        },
        categories: [
            "Food & Dining",
            "Transportation",
            "Shopping",
            "Entertainment",
            "Bills & Utilities",
            "Healthcare",
            "Travel",
            "Education",
            "Personal Care",
            "Other",
        ],
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
    const [newCategory, setNewCategory] = useState("")
    const [editingCategory, setEditingCategory] = useState<{ index: number; name: string } | null>(null)

    const theme = useTheme()

    const currencies = [
        { code: "PHP", name: "Philippine Peso (₱)", symbol: "₱" },
        { code: "USD", name: "US Dollar ($)", symbol: "$" },
        { code: "EUR", name: "Euro (€)", symbol: "€" },
        { code: "GBP", name: "British Pound (£)", symbol: "£" },
        { code: "JPY", name: "Japanese Yen (¥)", symbol: "¥" },
        { code: "SGD", name: "Singapore Dollar (S$)", symbol: "S$" },
        { code: "MYR", name: "Malaysian Ringgit (RM)", symbol: "RM" },
    ]

    const languages = [
        { code: "en", name: "English" },
        { code: "fil", name: "Filipino" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" },
    ]

    const themes = [
        { value: "light", name: "Light" },
        { value: "dark", name: "Dark" },
        { value: "system", name: "System" },
    ]

    // Load settings
    const loadSettings = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/user/settings")
            if (response.ok) {
                const data = await response.json()
                setSettings({ ...settings, ...data })
            }
        } catch (err) {
            console.error("Failed to load settings:", err)
        } finally {
            setLoading(false)
        }
    }

    // Save settings
    const handleSaveSettings = async () => {
        try {
            setLoading(true)
            setError("")
            setSuccess("")

            const response = await fetch("/api/user/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            })

            if (response.ok) {
                setSuccess("Settings saved successfully!")
                setTimeout(() => setSuccess(""), 3000)
            } else {
                setError("Failed to save settings")
            }
        } catch (err) {
            setError("Failed to save settings")
        } finally {
            setLoading(false)
        }
    }

    // Category management
    const handleAddCategory = () => {
        if (newCategory.trim() && !settings.categories.includes(newCategory.trim())) {
            setSettings({
                ...settings,
                categories: [...settings.categories, newCategory.trim()],
            })
            setNewCategory("")
            setOpenCategoryDialog(false)
        }
    }

    const handleEditCategory = (index: number) => {
        setEditingCategory({ index, name: settings.categories[index] })
        setNewCategory(settings.categories[index])
        setOpenCategoryDialog(true)
    }

    const handleUpdateCategory = () => {
        if (editingCategory && newCategory.trim()) {
            const updatedCategories = [...settings.categories]
            updatedCategories[editingCategory.index] = newCategory.trim()
            setSettings({
                ...settings,
                categories: updatedCategories,
            })
            setEditingCategory(null)
            setNewCategory("")
            setOpenCategoryDialog(false)
        }
    }

    const handleDeleteCategory = (index: number) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            const updatedCategories = settings.categories.filter((_, i) => i !== index)
            setSettings({
                ...settings,
                categories: updatedCategories,
            })
        }
    }

    const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false)
        setEditingCategory(null)
        setNewCategory("")
    }

    useEffect(() => {
        loadSettings()
    }, [])

    const getCurrencySymbol = (currencyCode: string) => {
        const currency = currencies.find((c) => c.code === currencyCode)
        return currency?.symbol || currencyCode
    }

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1000px",
                mx: "auto",
                p: { xs: 2, md: 4 },
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Settings
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 3,
                    }}
                >
                    Customize your budget tracker experience
                </Typography>
            </Box>

            {/* Alerts */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* General Settings */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            mb: 3,
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                <AttachMoneyIcon sx={{ mr: 2, color: theme.palette.success.main }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    General Settings
                                </Typography>
                            </Box>

                            <Stack spacing={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Currency</InputLabel>
                                    <Select
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        label="Currency"
                                    >
                                        {currencies.map((currency) => (
                                            <MenuItem key={currency.code} value={currency.code}>
                                                {currency.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Language</InputLabel>
                                    <Select
                                        value={settings.language}
                                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                        label="Language"
                                    >
                                        {languages.map((language) => (
                                            <MenuItem key={language.code} value={language.code}>
                                                {language.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Theme</InputLabel>
                                    <Select
                                        value={settings.theme}
                                        onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                                        label="Theme"
                                    >
                                        {themes.map((themeOption) => (
                                            <MenuItem key={themeOption.value} value={themeOption.value}>
                                                {themeOption.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Budget Limits */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            mb: 3,
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                <PaletteIcon sx={{ mr: 2, color: theme.palette.warning.main }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Budget Limits
                                </Typography>
                            </Box>

                            <Stack spacing={3}>
                                <TextField
                                    label={`Daily Limit (${getCurrencySymbol(settings.currency)})`}
                                    type="number"
                                    fullWidth
                                    value={settings.budgetLimits.daily}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            budgetLimits: {
                                                ...settings.budgetLimits,
                                                daily: Number.parseFloat(e.target.value) || 0,
                                            },
                                        })
                                    }
                                    inputProps={{ min: 0, step: 0.01 }}
                                />

                                <TextField
                                    label={`Weekly Limit (${getCurrencySymbol(settings.currency)})`}
                                    type="number"
                                    fullWidth
                                    value={settings.budgetLimits.weekly}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            budgetLimits: {
                                                ...settings.budgetLimits,
                                                weekly: Number.parseFloat(e.target.value) || 0,
                                            },
                                        })
                                    }
                                    inputProps={{ min: 0, step: 0.01 }}
                                />

                                <TextField
                                    label={`Monthly Limit (${getCurrencySymbol(settings.currency)})`}
                                    type="number"
                                    fullWidth
                                    value={settings.budgetLimits.monthly}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            budgetLimits: {
                                                ...settings.budgetLimits,
                                                monthly: Number.parseFloat(e.target.value) || 0,
                                            },
                                        })
                                    }
                                    inputProps={{ min: 0, step: 0.01 }}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Notifications */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            mb: 3,
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                <NotificationsIcon sx={{ mr: 2, color: theme.palette.info.main }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Notifications
                                </Typography>
                            </Box>

                            <Stack spacing={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.notifications.email}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    notifications: {
                                                        ...settings.notifications,
                                                        email: e.target.checked,
                                                    },
                                                })
                                            }
                                            color="primary"
                                        />
                                    }
                                    label="Email Notifications"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.notifications.push}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    notifications: {
                                                        ...settings.notifications,
                                                        push: e.target.checked,
                                                    },
                                                })
                                            }
                                            color="primary"
                                        />
                                    }
                                    label="Push Notifications"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.notifications.budgetAlerts}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    notifications: {
                                                        ...settings.notifications,
                                                        budgetAlerts: e.target.checked,
                                                    },
                                                })
                                            }
                                            color="primary"
                                        />
                                    }
                                    label="Budget Limit Alerts"
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Categories Management */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            mb: 3,
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <CategoryIcon sx={{ mr: 2, color: theme.palette.secondary.main }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        Categories
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenCategoryDialog(true)}
                                >
                                    Add
                                </Button>
                            </Box>

                            <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                                <List dense>
                                    {settings.categories.map((category, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                borderRadius: 1,
                                                mb: 1,
                                                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                            }}
                                        >
                                            <ListItemText primary={category} />
                                            <ListItemSecondaryAction>
                                                <IconButton size="small" onClick={() => handleEditCategory(index)} sx={{ mr: 1 }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDeleteCategory(index)} color="error">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Save Button */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSaveSettings}
                    disabled={loading}
                    sx={{
                        backgroundColor: theme.palette.success.main,
                        "&:hover": {
                            backgroundColor: theme.palette.success.dark,
                        },
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                    }}
                >
                    {loading ? "Saving..." : "Save Settings"}
                </Button>
            </Box>

            {/* Category Dialog */}
            <Dialog
                open={openCategoryDialog}
                onClose={handleCloseCategoryDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(20px)",
                    },
                }}
            >
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        fullWidth
                        variant="outlined"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
                    <Button
                        onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.success.main,
                            "&:hover": {
                                backgroundColor: theme.palette.success.dark,
                            },
                        }}
                    >
                        {editingCategory ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Settings
