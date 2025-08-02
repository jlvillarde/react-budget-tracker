"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Fab,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    Alert,
    CircularProgress,
    Stack,
    useTheme,
    alpha,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Pagination,
    InputAdornment,
    OutlinedInput,
    Paper,
    Divider,
    // Grid,
} from "@mui/material"
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Receipt as ReceiptIcon,
    FilterList as FilterListIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Info as InfoIcon,
    Edit as EditIcon,
    // TrendingUp as TrendingUpIcon,
    // Category as CategoryIcon,
    // ReceiptLong as ReceiptLongIcon,
} from "@mui/icons-material"

// Add type declaration for window
declare global {
    interface Window {
        refreshNotifications?: () => void
    }
}

interface ExpenseDTO {
    id?: number
    amount: number | string
    description: string
    category: string
    date: string
}

const Expenses: React.FC = () => {
    const navigate = useNavigate()
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [editingExpense, setEditingExpense] = useState<ExpenseDTO | null>(null)
    const [formData, setFormData] = useState<ExpenseDTO>({
        amount: "" as any, // Start with empty string instead of 0
        description: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
    })
    const [submitting, setSubmitting] = useState(false)

    // Pagination and filtering
    const [page, setPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [filterCategory, setFilterCategory] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")

    const theme = useTheme()

    const [budgetExceededData, setBudgetExceededData] = useState<any[]>([])
    const [showBudgetModal, setShowBudgetModal] = useState(false)

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/categories")
            if (response.ok) {
                const data = await response.json()
                setCategories(data)
            } else {
                setError("Failed to fetch categories")
            }
        } catch (err) {
            setError("Failed to fetch categories")
        } finally {
            setLoading(false)
        }
    }

    // Fetch expenses
    const fetchExpenses = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/expenses")
            if (response.ok) {
                const data = await response.json()
                setExpenses(data)
            } else {
                setError("Failed to fetch expenses")
            }
        } catch (err) {
            setError("Failed to fetch expenses")
        } finally {
            setLoading(false)
        }
    }

    // Add expense
    const handleAddExpense = async () => {
        try {
            setSubmitting(true)
            const response = await fetch("/api/expenses/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    amount: typeof formData.amount === "string" ? Number.parseFloat(formData.amount) || 0 : formData.amount,
                }),
            })

            if (response.ok) {
                const responseData = await response.json()

                // Check if there are exceeded limits in the response
                if (responseData.limit_exceeded && responseData.details && responseData.details.length > 0) {
                    setBudgetExceededData(responseData.details)
                    setShowBudgetModal(true)
                }

                // Refresh notifications after successful expense operation
                if (window.refreshNotifications) {
                    window.refreshNotifications()
                }

                await fetchExpenses()
                handleCloseDialog()
            } else {
                setError("Failed to add expense")
            }
        } catch (err) {
            setError("Failed to add expense")
        } finally {
            setSubmitting(false)
        }
    }

    // Update expense
    const handleUpdateExpense = async () => {
        if (!editingExpense?.id) return

        try {
            setSubmitting(true)
            const response = await fetch(`/api/expenses/${editingExpense.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    amount: typeof formData.amount === "string" ? Number.parseFloat(formData.amount) || 0 : formData.amount,
                }),
            })

            if (response.ok) {
                const responseData = await response.json()

                // Check if there are exceeded limits in the response
                if (responseData.limit_exceeded && responseData.details && responseData.details.length > 0) {
                    setBudgetExceededData(responseData.details)
                    setShowBudgetModal(true)
                }

                // Refresh notifications after successful expense operation
                if (window.refreshNotifications) {
                    window.refreshNotifications()
                }

                await fetchExpenses()
                handleCloseDialog()
            } else {
                setError("Failed to update expense")
            }
        } catch (err) {
            setError("Failed to update expense")
        } finally {
            setSubmitting(false)
        }
    }

    // Delete expense
    const handleDeleteExpense = async (expenseId: number) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return

        try {
            const response = await fetch(`/api/expenses/${expenseId}`, {
                method: "DELETE",
            })

            if (response.ok) {
                await fetchExpenses()
            } else {
                setError("Failed to delete expense")
            }
        } catch (err) {
            setError("Failed to delete expense")
        }
    }

    // Dialog handlers
    const handleOpenDialog = (expense?: ExpenseDTO) => {
        if (expense) {
            setEditingExpense(expense)
            setFormData({ ...expense })
        } else {
            setEditingExpense(null)
            setFormData({
                amount: "" as any, // Start with empty string instead of 0
                description: "",
                category: "",
                date: new Date().toISOString().split("T")[0],
            })
        }
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingExpense(null)
        setError("")
    }

    const handleSubmit = () => {
        if (editingExpense) {
            handleUpdateExpense()
        } else {
            handleAddExpense()
        }
    }

    // Calculate total expenses
    // const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

    // Group expenses by category
    // const expensesByCategory = expenses.reduce(
    //     (acc, expense) => {
    //         acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
    //         return acc
    //     },
    //     {} as Record<string, number>,
    // )

    // Filter and pagination logic
    // ...existing code...
    const filteredExpenses = useMemo(() => {
        // Sort by date descending (latest first)
        const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        return sorted.filter((expense) => {
            const matchesCategory = !filterCategory || expense.category === filterCategory
            const matchesSearch =
                !searchTerm ||
                expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(expense.amount).includes(searchTerm)

            return matchesCategory && matchesSearch
        })
    }, [expenses, filterCategory, searchTerm])
    // ...existing code...

    const paginatedExpenses = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage
        return filteredExpenses.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredExpenses, page, itemsPerPage])

    // Handle page changes
    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage)
        // Scroll to top of expense list
        window.scrollTo({ top: 400, behavior: "smooth" })
    }

    useEffect(() => {
        fetchExpenses()
        fetchCategories()
    }, [])

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                }}
            >
                <CircularProgress size={60} sx={{ color: theme.palette.success.main }} />
            </Box>
        )
    }

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1200px",
                mx: "auto",
                px: { xs: 2, md: 4 },
                pt: { xs: 2 },
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                    }}
                >
                    Expense Tracker
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 3,
                    }}
                >
                    Track and manage your daily expenses
                </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            {/* Filter Bar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: { md: "center" } }}>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: { xs: "100%", md: 200 } }}>
                        <InputLabel
                            shrink
                            sx={{
                                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                px: 0.5,
                                transform: "translate(14px, -9px) scale(0.75)",
                                "&.Mui-focused": {
                                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                },
                            }}
                        >
                            Filter by Category
                        </InputLabel>
                        <Select
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value)
                                setPage(1) // Reset to first page when filter changes
                            }}
                            label=""
                            notched
                            displayEmpty
                            renderValue={(selected) => {
                                return selected ? selected : "All Categories"
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        maxHeight: 300,
                                        "&::-webkit-scrollbar": {
                                            width: "8px",
                                        },
                                        "&::-webkit-scrollbar-track": {
                                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                            borderRadius: "4px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: theme.palette.success.main,
                                            borderRadius: "4px",
                                            "&:hover": {
                                                backgroundColor: theme.palette.success.dark,
                                            },
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small" sx={{ flexGrow: 1 }}>
                        <OutlinedInput
                            placeholder="Search expenses..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setPage(1) // Reset to first page when search changes
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            }
                            endAdornment={
                                searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setSearchTerm("")} edge="end" size="small">
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        />
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        startIcon={<FilterListIcon />}
                        onClick={() => {
                            setFilterCategory("")
                            setSearchTerm("")
                            setPage(1)
                        }}
                        sx={{
                            display: filterCategory || searchTerm ? "flex" : "none",
                            alignSelf: { xs: "flex-end", md: "center" },
                            backgroundColor: theme.palette.primary.main,
                        }}
                    >
                        Clear Filters
                    </Button>
                </Box>
            </Paper>

            {/* Expenses List */}
            <Card
                elevation={0}
                sx={{
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 2,
                    mb: 3,
                }}
            >
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {filterCategory ? `${filterCategory} Expenses` : "All Expenses"}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{
                                backgroundColor: theme.palette.success.main,
                                "&:hover": {
                                    backgroundColor: theme.palette.success.dark,
                                },
                            }}
                        >
                            Add Expense
                        </Button>
                    </Box>

                    {filteredExpenses.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 6 }}>
                            <ReceiptIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 2 }} />
                            <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                                {expenses.length === 0 ? "No expenses yet" : "No expenses match your filters"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {expenses.length === 0
                                    ? "Start tracking your expenses by adding your first transaction"
                                    : "Try changing your search criteria or clear filters"}
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <List
                                sx={{
                                    maxHeight: "60vh",
                                    overflowY: "auto",
                                    "&::-webkit-scrollbar": {
                                        width: "8px",
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                        borderRadius: "4px",
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: theme.palette.success.main,
                                        borderRadius: "4px",
                                        border: `2px solid ${alpha(theme.palette.background.paper, 0.5)}`,
                                        "&:hover": {
                                            backgroundColor: theme.palette.success.dark,
                                        },
                                    },
                                    scrollbarWidth: "thin",
                                    scrollbarColor: `${theme.palette.success.main} ${alpha(theme.palette.background.paper, 0.5)}`,
                                }}
                            >
                                {paginatedExpenses.map((expense) => (
                                    <ListItem
                                        key={expense.id}
                                        sx={{
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            borderRadius: 2,
                                            mb: 1,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                            "&:hover": {
                                                boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                                                transform: "translateY(-2px)",
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: { xs: "0.95rem", sm: "1.25rem" }, // Smaller on mobile
                                                        }}
                                                    >
                                                        {expense.description}
                                                    </Typography>
                                                    <Chip
                                                        label={expense.category}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                filterCategory === expense.category
                                                                    ? alpha(theme.palette.success.main, 0.15)
                                                                    : alpha(theme.palette.primary.main, 0.1),
                                                            color:
                                                                filterCategory === expense.category
                                                                    ? theme.palette.success.dark
                                                                    : theme.palette.primary.main,
                                                            fontSize: { xs: "0.7rem", sm: "0.8125rem" }, // Smaller on mobile
                                                            height: { xs: 22, sm: 24 }, // Smaller height on mobile
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: theme.palette.text.secondary,
                                                            fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller on mobile
                                                        }}
                                                    >
                                                        Date: {new Date(expense.date).toLocaleDateString()}
                                                    </Typography>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: theme.palette.success.main,
                                                            fontSize: { xs: "0.9rem", sm: "1rem" }, // Smaller on mobile
                                                        }}
                                                    >
                                                        ₱{Number(expense.amount).toFixed(2)}
                                                    </Typography>
                                                </Stack>
                                            }
                                        />

                                        <ListItemSecondaryAction>
                                            <IconButton
                                                onClick={() => handleOpenDialog(expense)}
                                                sx={{
                                                    mr: 1,
                                                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                                                    width: { xs: 32, sm: 36 }, // Smaller on mobile
                                                    height: { xs: 32, sm: 36 },
                                                    "&:hover": {
                                                        backgroundColor: alpha(theme.palette.primary.light, 0.2),
                                                    },
                                                }}
                                            >
                                                <EditIcon
                                                    fontSize="small"
                                                    color="primary"
                                                    sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} // Smaller icon on mobile
                                                />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => expense.id && handleDeleteExpense(expense.id)}
                                                sx={{
                                                    backgroundColor: alpha(theme.palette.error.light, 0.1),
                                                    width: { xs: 32, sm: 36 }, // Smaller on mobile
                                                    height: { xs: 32, sm: 36 },
                                                    "&:hover": {
                                                        backgroundColor: alpha(theme.palette.error.light, 0.2),
                                                    },
                                                }}
                                            >
                                                <DeleteIcon
                                                    fontSize="small"
                                                    color="error"
                                                    sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} // Smaller icon on mobile
                                                />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>

                            {/* Pagination */}
                            {filteredExpenses.length > itemsPerPage && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        pt: 3,
                                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        mt: 2,
                                    }}
                                >
                                    <Pagination
                                        count={Math.ceil(filteredExpenses.length / itemsPerPage)}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        sx={{
                                            "& .MuiPaginationItem-root": {
                                                fontSize: "1rem",
                                            },
                                            "& .Mui-selected": {
                                                backgroundColor: alpha(theme.palette.success.main, 0.15),
                                                color: theme.palette.success.dark,
                                                "&:hover": {
                                                    backgroundColor: alpha(theme.palette.success.main, 0.25),
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(20px)",
                    },
                }}
            >
                <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField
                            label="Description"
                            fullWidth
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />

                        <TextField
                            label="Amount (₱)"
                            type="number"
                            fullWidth
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value === "" ? "" : Number.parseFloat(e.target.value) || "",
                                })
                            }
                            required
                            inputProps={{ min: 0, step: 0.01 }}
                            placeholder="0.00"
                        />

                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                label="Category"
                                required
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                                <MenuItem key="others" value="others">
                                    Others
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Date"
                            type="date"
                            fullWidth
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitting}
                        sx={{
                            backgroundColor: theme.palette.success.main,
                            "&:hover": {
                                backgroundColor: theme.palette.success.dark,
                            },
                        }}
                    >
                        {submitting ? <CircularProgress size={20} /> : editingExpense ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Button for Mobile */}
            <Fab
                color="primary"
                aria-label="add expense"
                onClick={() => handleOpenDialog()}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    display: { xs: "flex", md: "none" },
                    backgroundColor: theme.palette.success.main,
                    "&:hover": {
                        backgroundColor: theme.palette.success.dark,
                    },
                }}
            >
                <AddIcon />
            </Fab>

            {/* Budget Exceeded Modal */}
            <Dialog
                open={showBudgetModal}
                onClose={() => setShowBudgetModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: alpha(theme.palette.background.paper, 0.95),
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderRadius: 2,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        pb: 2,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    <InfoIcon sx={{ color: theme.palette.text.secondary, fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        Budget Notification
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pt: 3, pb: 2 }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                        Your recent expense has exceeded the following budget limits:
                    </Typography>

                    <Stack spacing={2}>
                        {budgetExceededData.map((limit, index) => (
                            <Box key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        borderRadius: 1.5,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            color: theme.palette.text.primary,
                                            mb: 1,
                                        }}
                                    >
                                        {limit.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {limit.detail}
                                    </Typography>
                                </Paper>
                                {index < budgetExceededData.length - 1 && <Divider sx={{ my: 1, opacity: 0.3 }} />}
                            </Box>
                        ))}
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 3,
                        pt: 2,
                        gap: 1,
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    <Button
                        onClick={() => setShowBudgetModal(false)}
                        sx={{
                            color: theme.palette.text.secondary,
                            "&:hover": {
                                backgroundColor: alpha(theme.palette.text.secondary, 0.05),
                            },
                        }}
                    >
                        Dismiss
                    </Button>
                    <Button
                        onClick={() => {
                            setShowBudgetModal(false)
                            navigate("/dashboard/settings")
                        }}
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            "&:hover": {
                                backgroundColor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        Adjust Settings
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Expenses
