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
    // Switch,
    // FormControl,
    // InputLabel,
    // Select,
    // MenuItem,
    Alert,
    CircularProgress,
    Stack,
    useTheme,
    alpha,
    // Grid,
    // FormControlLabel,
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
    // AttachMoney as AttachMoneyIcon,
    Category as CategoryIcon,
} from "@mui/icons-material"

interface UserSettings {
    currency: string
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
        budgetLimits: {
            daily: 0,
            weekly: 0,
            monthly: 0
        },
        categories: [],
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

    // No language or theme options needed

    // Load settings
    const loadSettings = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/settings")
            if (response.ok) {
                const data = await response.json()
                setSettings(prevSettings => ({
                    ...prevSettings,
                    ...data
                }))
            }
        } catch (err) {
            console.error("Failed to load settings:", err)
            setError("Failed to load settings")
        } finally {
            setLoading(false)
        }
    }

    const loadCategories = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/categories")
            if (response.ok) {
                const categories = await response.json()
                setSettings(prevSettings => ({
                    ...prevSettings,
                    categories: [...categories]
                }))
            }
        } catch (err) {
            console.error("Failed to load categories:", err)
            setError("Failed to load categories")
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

            const response = await fetch("/api/settings", {
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
    const handleAddCategory = async () => {
        const trimmedCategory = newCategory.trim()
        // if (!trimmedCategory || settings.categories.includes(trimmedCategory)) return

        try {
            // Send PUT request to update categories on the server
            // const updatedCategories = [...settings.categories, trimmedCategory]

            const response = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: trimmedCategory }),
            })

            if (response.ok) {
                const updatedCategories = await response.json()
                console.log(updatedCategories);
                setSettings(prev => ({
                    ...prev,
                    categories: updatedCategories,
                }))
                setSuccess("Category added successfully!")
            } else {
                setError("Failed to update categories.")
            }
        } catch (err) {
            console.error(err)
            setError("An error occurred while adding the category.")
        } finally {
            setNewCategory("")
            setOpenCategoryDialog(false)
        }
    }


    const handleEditCategory = (index: number) => {
        setEditingCategory({ index, name: settings.categories[index] })
        setNewCategory(settings.categories[index])
        setOpenCategoryDialog(true)
    }

    const handleUpdateCategory = async () => {
        if (editingCategory && newCategory.trim()) {
            const oldName = settings.categories[editingCategory.index]
            const newName = newCategory.trim()

            try {
                const response = await fetch("/api/categories", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        old_name: oldName,
                        new_name: newName
                    }),
                })

                if (response.ok) {
                    const updatedCategories = [...settings.categories]
                    updatedCategories[editingCategory.index] = newName
                    setSettings(prevSettings => ({
                        ...prevSettings,
                        categories: updatedCategories,
                    }))
                    setSuccess("Category updated successfully!")
                } else {
                    const error = await response.json()
                    setError(error.detail || "Failed to update category.")
                }
            } catch (err) {
                console.error(err)
                setError("An error occurred while updating the category.")
            } finally {
                setEditingCategory(null)
                setNewCategory("")
                setOpenCategoryDialog(false)
            }
        }
    }


    const handleDeleteCategory = async (index: number) => {
        const categoryToDelete = settings.categories[index]

        if (!categoryToDelete) return

        const confirmDelete = window.confirm(`Are you sure you want to delete "${categoryToDelete}"?`)
        if (!confirmDelete) return

        try {
            const response = await fetch("/api/categories", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: categoryToDelete }),
            })

            if (response.ok) {
                const updatedCategories = settings.categories.filter((_, i) => i !== index)
                setSettings(prevSettings => ({
                    ...prevSettings,
                    categories: updatedCategories,
                }))
            } else {
                const error = await response.json()
                setError(error.detail || "Failed to delete category.")
            }
        } catch (err) {
            console.error(err)
            setError("An error occurred while deleting the category.")
        }
    }


    const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false)
        setEditingCategory(null)
        setNewCategory("")
    }

    const getCurrencySymbol = (currencyCode: string) => {
        const currency = currencies.find((c) => c.code === currencyCode)
        return currency?.symbol || currencyCode
    }

    useEffect(() => {
        loadSettings()
        loadCategories()
    }, [])


    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1100px",
                mx: "auto",
                p: { xs: 2, md: 4 },
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                    variant="h4"
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
                    variant="subtitle1"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 1,
                    }}
                >
                    Customize your budget tracker experience
                </Typography>
            </Box>

            {/* Alerts */}
            <Stack spacing={2} sx={{ mb: 3 }}>
                {error && (
                    <Alert severity="error" onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" onClose={() => setSuccess("")}>
                        {success}
                    </Alert>
                )}
            </Stack>

            <Stack
                spacing={4}
                sx={{
                    maxHeight: "100vh",
                    height: "fit-content",
                    // justifyContent: "center", // vertical centering
                    alignItems: "center",
                    mb: 4    // horizontal centering
                }} >

                {/* Budget Limits */}
                <Card
                    elevation={1}
                    sx={{
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                        width: "100%",
                        maxWidth: "800px",
                        mx: "auto"
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                            <Box sx={{
                                backgroundColor: alpha(theme.palette.warning.light, 0.2),
                                p: 1,
                                borderRadius: 1,
                                display: "flex",
                                mr: 2
                            }}>
                                <PaletteIcon sx={{ color: theme.palette.warning.main }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                Budget Limits
                            </Typography>
                        </Box>

                        <Stack spacing={3}>
                            <TextField
                                label={`Daily Limit (${getCurrencySymbol(settings.currency)})`}
                                type="number"
                                fullWidth
                                variant="outlined"
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
                                InputProps={{
                                    startAdornment: (
                                        <Box component="span" sx={{ mr: 1, color: theme.palette.text.secondary }}>
                                            {getCurrencySymbol(settings.currency)}
                                        </Box>
                                    ),
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                            />

                            <TextField
                                label={`Weekly Limit (${getCurrencySymbol(settings.currency)})`}
                                type="number"
                                fullWidth
                                variant="outlined"
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
                                InputProps={{
                                    startAdornment: (
                                        <Box component="span" sx={{ mr: 1, color: theme.palette.text.secondary }}>
                                            {getCurrencySymbol(settings.currency)}
                                        </Box>
                                    ),
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                            />

                            <TextField
                                label={`Monthly Limit (${getCurrencySymbol(settings.currency)})`}
                                type="number"
                                fullWidth
                                variant="outlined"
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
                                InputProps={{
                                    startAdornment: (
                                        <Box component="span" sx={{ mr: 1, color: theme.palette.text.secondary }}>
                                            {getCurrencySymbol(settings.currency)}
                                        </Box>
                                    ),
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Categories Management */}
                <Card
                    elevation={1}
                    sx={{
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                        width: "100%",
                        maxWidth: "800px",
                        mx: "auto"
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box sx={{
                                    backgroundColor: alpha(theme.palette.secondary.light, 0.2),
                                    p: 1,
                                    borderRadius: 1,
                                    display: "flex",
                                    mr: 2
                                }}>
                                    <CategoryIcon sx={{ color: theme.palette.secondary.main }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Categories
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenCategoryDialog(true)}
                                sx={{ borderRadius: 1.5 }}
                            >
                                Add
                            </Button>
                        </Box>

                        <Box sx={{
                            maxHeight: 300,
                            overflowY: "auto",
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            p: 1,
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.success.main,
                                borderRadius: '4px',
                                border: `2px solid ${alpha(theme.palette.background.paper, 0.5)}`,
                                '&:hover': {
                                    backgroundColor: theme.palette.success.dark,
                                }
                            },
                            scrollbarWidth: 'thin',
                            scrollbarColor: `${theme.palette.success.main} ${alpha(theme.palette.background.paper, 0.5)}`
                        }}>
                            <List dense>
                                {settings.categories.map((category, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            borderRadius: 1.5,
                                            mb: 1,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                        }}
                                    >
                                        <ListItemText
                                            primary={category}
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditCategory(index)}
                                                sx={{
                                                    mr: 1,
                                                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.light, 0.2),
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" color="primary" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteCategory(index)}
                                                sx={{
                                                    backgroundColor: alpha(theme.palette.error.light, 0.1),
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.error.light, 0.2),
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" color="error" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>

            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
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
                        px: 6,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: 2,
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
                        backgroundColor: alpha(theme.palette.background.paper, 0.95),
                        backdropFilter: "blur(20px)",
                        borderRadius: 2,
                        boxShadow: 24,
                    },
                }}
            >
                <DialogTitle sx={{
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    pb: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CategoryIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                        <Typography variant="h6">
                            {editingCategory ? "Edit Category" : "Add New Category"}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        fullWidth
                        variant="outlined"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        InputProps={{
                            sx: { borderRadius: 1.5 }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleCloseCategoryDialog}
                        variant="outlined"
                        sx={{ borderRadius: 1.5 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            "&:hover": {
                                backgroundColor: theme.palette.secondary.dark,
                            },
                            borderRadius: 1.5,
                            ml: 2
                        }}
                        disabled={!newCategory.trim()}
                    >
                        {editingCategory ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    )
}

export default Settings
