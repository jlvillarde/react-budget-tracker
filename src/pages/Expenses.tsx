"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
    Grid,
} from "@mui/material"
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Receipt as ReceiptIcon,
    TrendingUp as TrendingUpIcon,
    Category as CategoryIcon,
    ReceiptLong as ReceiptLongIcon, // Changed from CurrencyExchangeIcon
} from "@mui/icons-material"

interface ExpenseDTO {
    id?: number
    amount: number | string
    description: string
    category: string
    date: string
}

const Expenses: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([])
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

    const theme = useTheme()

    const categories = [
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
    ]

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
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

    // Group expenses by category
    const expensesByCategory = expenses.reduce(
        (acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
            return acc
        },
        {} as Record<string, number>,
    )

    useEffect(() => {
        fetchExpenses()
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
                        background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
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

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                        }}
                    >
                        <CardContent sx={{ textAlign: "center" }}>
                            <ReceiptLongIcon
                                sx={{
                                    fontSize: 40,
                                    color: theme.palette.success.main,
                                    mb: 1,
                                }}
                            />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                                ₱{totalExpenses.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Total Expenses
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                    >
                        <CardContent sx={{ textAlign: "center" }}>
                            <ReceiptIcon
                                sx={{
                                    fontSize: 40,
                                    color: theme.palette.primary.main,
                                    mb: 1,
                                }}
                            />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                {expenses.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Total Transactions
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                        }}
                    >
                        <CardContent sx={{ textAlign: "center" }}>
                            <CategoryIcon
                                sx={{
                                    fontSize: 40,
                                    color: theme.palette.secondary.main,
                                    mb: 1,
                                }}
                            />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                                {Object.keys(expensesByCategory).length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Categories Used
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.warning.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                        }}
                    >
                        <CardContent sx={{ textAlign: "center" }}>
                            <TrendingUpIcon
                                sx={{
                                    fontSize: 40,
                                    color: theme.palette.warning.main,
                                    mb: 1,
                                }}
                            />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                                ₱{expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : "₱0.00"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Average per Transaction
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Expenses List */}
            <Card
                elevation={0}
                sx={{
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Recent Expenses
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

                    {expenses.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 6 }}>
                            <ReceiptIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 2 }} />
                            <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                                No expenses yet
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Start tracking your expenses by adding your first transaction
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {expenses.map((expense) => (
                                <ListItem
                                    key={expense.id}
                                    sx={{
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        borderRadius: 2,
                                        mb: 1,
                                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {expense.description}
                                                </Typography>
                                                <Chip
                                                    label={expense.category}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        color: theme.palette.primary.main,
                                                    }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                    Date: {new Date(expense.date).toLocaleDateString()}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: theme.palette.success.main,
                                                    }}
                                                >
                                                    ₱{Number(expense.amount).toFixed(2)}
                                                </Typography>
                                            </Stack>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => handleOpenDialog(expense)} sx={{ mr: 1 }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => expense.id && handleDeleteExpense(expense.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
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
        </Box>
    )
}

export default Expenses
