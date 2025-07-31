import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    useTheme,
    alpha,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Stack,
    Divider,
    CircularProgress,
    Paper,
    // Button,
    IconButton,
    Tooltip,
    Tab,
    Tabs,
    Chip,
    useMediaQuery,
} from "@mui/material";
import {
    ReceiptLong as ReceiptLongIcon,
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    ShowChart as LineChartIcon,
    CalendarViewMonth as CalendarIcon,
    Info as InfoIcon,
    // Download as DownloadIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Lightbulb as LightbulbIcon,
} from "@mui/icons-material";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    LineChart,
    Line,
} from "recharts";

// Types
interface ExpenseDTO {
    id?: number;
    amount: number | string;
    description: string;
    category: string;
    date: string;
}

const Analytics: React.FC = () => {
    // State
    // const [categories, setCategories] = useState<string[]>([])
    const [, setCategories] = useState<string[]>([])
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");
    const [, setError] = useState("");
    const [timeFrame, setTimeFrame] = useState("month");
    const [activeTab, setActiveTab] = useState(0);

    const theme = useTheme();
    // Check if screen is mobile size
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // const isMedium = useMediaQuery(theme.breakpoints.down('md'));

    const COLORS = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
        "#9c27b0", // purple
        "#00bcd4", // cyan
        "#ff9800", // orange
        "#607d8b", // blue grey
        "#795548", // brown
    ];

    // Generate mock data for demonstration when API fails
    // const generateMockData = () => {
    //     const mockData: ExpenseDTO[] = [];
    //     const now = new Date();
    //     const categories = [
    //         "Food & Dining",
    //         "Transportation",
    //         "Shopping",
    //         "Entertainment",
    //         "Bills & Utilities",
    //         "Healthcare",
    //         "Travel",
    //         "Education",
    //         "Personal Care",
    //         "Other",
    //     ];

    //     for (let i = 0; i < 50; i++) {
    //         const randomDaysAgo = Math.floor(Math.random() * 180); // Past 6 months
    //         const date = new Date(now);
    //         date.setDate(now.getDate() - randomDaysAgo);

    //         mockData.push({
    //             id: i + 1,
    //             amount: Math.floor(Math.random() * 5000) + 100, // Between 100 and 5100
    //             description: `Expense ${i + 1}`,
    //             category: categories[Math.floor(Math.random() * categories.length)],
    //             date: date.toISOString().split('T')[0],
    //         });
    //     }

    //     return mockData;
    // };

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

    useEffect(() => {
        fetchExpenses();
        fetchCategories()
    }, []);

    const handleTimeFrameChange = (event: any) => {
        setTimeFrame(event.target.value);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Filter expenses based on the selected time frame
    const filteredExpenses = expenses.filter((expense) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const expenseDate = new Date(expense.date);

        switch (timeFrame) {
            case "week":
                const oneWeekAgo = new Date(today);
                oneWeekAgo.setDate(today.getDate() - 7);
                return expenseDate >= oneWeekAgo;
            case "month":
                const oneMonthAgo = new Date(today);
                oneMonthAgo.setMonth(today.getMonth() - 1);
                return expenseDate >= oneMonthAgo;
            case "quarter":
                const threeMonthsAgo = new Date(today);
                threeMonthsAgo.setMonth(today.getMonth() - 3);
                return expenseDate >= threeMonthsAgo;
            case "year":
                const oneYearAgo = new Date(today);
                oneYearAgo.setFullYear(today.getFullYear() - 1);
                return expenseDate >= oneYearAgo;
            case "all":
                return true;
            default:
                return true;
        }
    });

    // Calculate expenses by category
    const expensesByCategory = (() => {
        const categoryMap: Record<string, number> = {};

        filteredExpenses.forEach((expense) => {
            const category = expense.category || "Other";
            const amount = typeof expense.amount === "string" ? parseFloat(expense.amount) : expense.amount;

            if (!categoryMap[category]) {
                categoryMap[category] = 0;
            }

            categoryMap[category] += amount;
        });

        return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    })();

    // Prepare data for the monthly expense chart
    const monthlyExpenseData = (() => {
        const monthMap: Record<string, number> = {};
        const now = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${monthNames[month.getMonth()]} ${month.getFullYear()}`;
            monthMap[monthKey] = 0;
        }

        // Fill with actual data
        filteredExpenses.forEach((expense) => {
            const expenseDate = new Date(expense.date);
            const monthKey = `${monthNames[expenseDate.getMonth()]} ${expenseDate.getFullYear()}`;
            const amount = typeof expense.amount === "string" ? parseFloat(expense.amount) : expense.amount;

            if (monthMap[monthKey] !== undefined) {
                monthMap[monthKey] += amount;
            }
        });

        return Object.entries(monthMap).map(([month, amount]) => ({
            month,
            amount
        }));
    })();

    // Daily expense trend data
    const dailyExpenseData = (() => {
        const dailyMap: Record<string, number> = {};
        const now = new Date();

        // Initialize last 14 days
        for (let i = 13; i >= 0; i--) {
            const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            const dayKey = day.toISOString().split('T')[0];
            dailyMap[dayKey] = 0;
        }

        // Fill with actual data
        filteredExpenses.forEach((expense) => {
            const expenseDate = new Date(expense.date);
            const dayKey = expenseDate.toISOString().split('T')[0];
            const amount = typeof expense.amount === "string" ? parseFloat(expense.amount) : expense.amount;

            if (dailyMap[dayKey] !== undefined) {
                dailyMap[dayKey] += amount;
            }
        });

        return Object.entries(dailyMap).map(([date, amount]) => {
            const dateObj = new Date(date);
            return {
                date: `${dateObj.getDate()}/${dateObj.getMonth() + 1}`,
                amount
            };
        });
    })();

    // Top expense categories
    const topCategories = [...expensesByCategory]
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // Calculate summary statistics
    const totalExpense = filteredExpenses.reduce((sum, expense) => {
        return sum + (typeof expense.amount === "string" ? parseFloat(expense.amount) : expense.amount);
    }, 0);

    const averageExpense = filteredExpenses.length === 0 ? 0 : totalExpense / filteredExpenses.length;

    const highestExpenseCategory = expensesByCategory.length === 0
        ? { name: "None", value: 0 }
        : expensesByCategory.reduce((max, category) =>
            category.value > max.value ? category : max,
            { name: "", value: 0 }
        );

    // For spending pattern analysis
    const spendingByDayOfWeek = (() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayTotals = Array(7).fill(0);
        const dayCounts = Array(7).fill(0);

        filteredExpenses.forEach(expense => {
            const date = new Date(expense.date);
            const dayIndex = date.getDay();
            const amount = typeof expense.amount === "string" ? parseFloat(expense.amount) : expense.amount;

            dayTotals[dayIndex] += amount;
            dayCounts[dayIndex]++;
        });

        return days.map((day, index) => ({
            name: isMobile ? day.substring(0, 3) : day, // Shorten day names on mobile
            total: dayTotals[index],
            average: dayCounts[index] ? dayTotals[index] / dayCounts[index] : 0,
            count: dayCounts[index]
        }));
    })();

    const highestSpendingDay = spendingByDayOfWeek.length
        ? spendingByDayOfWeek.reduce((max, day) => day.total > max.total ? day : max, { name: "", total: 0 })
        : { name: "", total: 0 };

    // Calculate month-over-month change
    const monthOverMonthChange = (() => {
        if (monthlyExpenseData.length < 2) return { value: 0, isIncrease: false };

        const current = monthlyExpenseData[monthlyExpenseData.length - 1].amount;
        const previous = monthlyExpenseData[monthlyExpenseData.length - 2].amount;
        const change = current - previous;

        return {
            value: Math.abs(change),
            isIncrease: change > 0,
            percentage: previous > 0 ? Math.abs((change / previous) * 100) : 0
        };
    })();

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
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1200px",
                mx: "auto",
                px: { xs: 2, sm: 3, md: 4 },
                pt: { xs: 1, sm: 2 },
            }}
        >
            {/* Header */}
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, textAlign: "center" }}>
                <Typography
                    variant={isMobile ? "h4" : "h3"}
                    sx={{
                        fontWeight: 700,
                        mb: { xs: 1, sm: 2 },
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                        background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.dark} 90%)`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Expense Analytics
                </Typography>
                <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                    }}
                >
                    Visualize and analyze your spending patterns
                </Typography>
            </Box>

            {/* Time Frame Selector & Download Button */}
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 2, sm: 3, md: 4 },
                flexWrap: "wrap",
                gap: 2,
                flexDirection: isMobile ? 'column' : 'row',
                width: '100%'
            }}>
                <FormControl sx={{
                    minWidth: isMobile ? '100%' : 200,
                    width: isMobile ? '100%' : 'auto',
                }}>
                    <InputLabel>Time Frame</InputLabel>
                    <Select
                        value={timeFrame}
                        label="Time Frame"
                        onChange={handleTimeFrameChange}
                        size={isMobile ? "small" : "medium"}
                    >
                        <MenuItem value="week">Last 7 Days</MenuItem>
                        <MenuItem value="month">Last 30 Days</MenuItem>
                        <MenuItem value="quarter">Last 3 Months</MenuItem>
                        <MenuItem value="year">Last Year</MenuItem>
                        <MenuItem value="all">All Time</MenuItem>
                    </Select>
                </FormControl>

                {/* <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                        borderColor: theme.palette.success.main,
                        color: theme.palette.success.main,
                        width: isMobile ? '100%' : 'auto',
                        "&:hover": {
                            borderColor: theme.palette.success.dark,
                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                        },
                    }}
                    onClick={() => alert("Export functionality would be implemented here")}
                >
                    Export Report
                </Button> */}
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: { xs: 2, sm: 3, md: 4 }, py: { xs: 3 } }}>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{
                            textAlign: "center",
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2,
                            "&:last-child": { pb: isMobile ? 1 : 2 }
                        }}>
                            <ReceiptLongIcon
                                sx={{
                                    fontSize: isMobile ? 24 : 40,
                                    color: theme.palette.success.main,
                                    mb: 0.5,
                                }}
                            />
                            <Typography
                                variant={isMobile ? "h6" : "h4"}
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.success.main,
                                    fontSize: { xs: '1.1rem', sm: '1.5rem' },
                                }}
                            >
                                ₱{totalExpense.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                }}
                            >
                                Total Expenses
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{
                            textAlign: "center",
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2,
                            "&:last-child": { pb: isMobile ? 1 : 2 }
                        }}>
                            <LineChartIcon
                                sx={{
                                    fontSize: isMobile ? 24 : 40,
                                    color: theme.palette.primary.main,
                                    mb: 0.5,
                                }}
                            />
                            <Typography
                                variant={isMobile ? "h6" : "h4"}
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    fontSize: { xs: '1.1rem', sm: '1.5rem' },
                                }}
                            >
                                ₱{averageExpense.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                }}
                            >
                                Average per Transaction
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{
                            textAlign: "center",
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2,
                            "&:last-child": { pb: isMobile ? 1 : 2 }
                        }}>
                            <PieChartIcon
                                sx={{
                                    fontSize: isMobile ? 24 : 40,
                                    color: theme.palette.secondary.main,
                                    mb: 0.5,
                                }}
                            />
                            <Typography
                                variant={isMobile ? "h6" : "h4"}
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.secondary.main,
                                    fontSize: { xs: '1.1rem', sm: '1.5rem' },
                                }}
                            >
                                {highestExpenseCategory.name !== "None"
                                    ? highestExpenseCategory.name.split(' ')[0]
                                    : "None"}
                            </Typography>
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                }}
                            >
                                Top Spending Category
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.warning.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{
                            textAlign: "center",
                            py: isMobile ? 1 : 2,
                            px: isMobile ? 1 : 2,
                            "&:last-child": { pb: isMobile ? 1 : 2 }
                        }}>
                            <CalendarIcon
                                sx={{
                                    fontSize: isMobile ? 24 : 40,
                                    color: theme.palette.warning.main,
                                    mb: 0.5,
                                }}
                            />
                            <Typography
                                variant={isMobile ? "h6" : "h4"}
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.warning.main,
                                    fontSize: { xs: '1.1rem', sm: '1.5rem' },
                                }}
                            >
                                {filteredExpenses.length}
                            </Typography>
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                }}
                            >
                                Transactions
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Chart Navigation */}
            <Box
                sx={{
                    mb: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        width: '100%',
                        maxWidth: '100%',
                        minHeight: isMobile ? 40 : 48,
                        '& .MuiTabs-flexContainer': {
                            minWidth: 'max-content',
                        },
                        '& .MuiTabs-scroller': {
                            overflow: 'auto',
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        },
                        '& .MuiTabs-scrollButtons': {
                            width: { xs: 24, sm: 30, md: 40 },
                            '&.Mui-disabled': {
                                opacity: 0.3,
                            },
                        },
                        '& .MuiTab-root': {
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                            minWidth: { xs: 80, sm: 100, md: 120 },
                            maxWidth: { xs: 120, sm: 140, md: 200 },
                            px: { xs: 1, sm: 1.5, md: 1.5 },
                            py: { xs: 1, sm: 1.25, md: 1.5 },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: isMobile ? 48 : 48,
                        },
                        '& .MuiTabs-indicator': {
                            height: 3,
                        },
                    }}
                >
                    <Tab
                        icon={<PieChartIcon sx={{ fontSize: { xs: '1.5rem', sm: '0.9rem', md: '1.1rem' } }} />}
                        iconPosition="start"
                        label={
                            <Box component="span" sx={{
                                display: { xs: 'none', sm: 'inline' }
                            }}>
                                Category Breakdown
                            </Box>
                        }
                    />
                    <Tab
                        icon={<BarChartIcon sx={{ fontSize: { xs: '1.5rem', sm: '0.9rem', md: '1.1rem' } }} />}
                        iconPosition="start"
                        label={
                            <Box component="span" sx={{
                                display: { xs: 'none', sm: 'inline' }
                            }}>
                                Monthly Trends
                            </Box>
                        }
                    />
                    <Tab
                        icon={<LineChartIcon sx={{ fontSize: { xs: '1.5rem', sm: '0.9rem', md: '1.1rem' } }} />}
                        iconPosition="start"
                        label={
                            <Box component="span" sx={{
                                display: { xs: 'none', sm: 'inline' }
                            }}>
                                Daily Spending
                            </Box>
                        }
                    />
                    <Tab
                        icon={<CalendarIcon sx={{ fontSize: { xs: '1.5rem', sm: '0.9rem', md: '1.1rem' } }} />}
                        iconPosition="start"
                        label={
                            <Box component="span" sx={{
                                display: { xs: 'none', sm: 'inline' }
                            }}>
                                Day of Week Analysis
                            </Box>
                        }
                    />
                </Tabs>
            </Box>

            {/* Charts */}
            <Box sx={{ mb: 4 }}>
                {activeTab === 0 && (
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            p: { xs: 1, sm: 2 }
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 1, sm: 2 }, px: 1 }}>
                            <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, fontSize: isMobile ? '1.05rem' : undefined }}>
                                Expense Distribution by Category
                            </Typography>
                            <Tooltip title="Shows how your spending is distributed across different categories">
                                <IconButton size="small">
                                    <InfoIcon fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Grid container spacing={isMobile ? 1.5 : 3} direction={isMobile ? 'column' : 'row'}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                {expensesByCategory.length > 0 ? (
                                    <Box sx={{ height: { xs: 200, sm: 350, md: 400 }, mb: isMobile ? 2 : 0 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={expensesByCategory}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={isMobile ? 70 : 150}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={isMobile ? false : (props) =>
                                                        props.name && typeof props.percent === 'number'
                                                            ? `${props.name}: ${(props.percent * 100).toFixed(0)}%`
                                                            : ''
                                                    }
                                                >
                                                    {expensesByCategory.map((_entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip formatter={(value: number) => `₱${value}`} contentStyle={{ fontSize: isMobile ? 11 : 14 }} />
                                                {!isMobile && <Legend />}
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                ) : (
                                    <Box sx={{ height: { xs: 200, sm: 350, md: 400 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: theme.palette.text.secondary, fontSize: isMobile ? '0.95rem' : { xs: '1rem', md: '1.25rem' } }}>
                                            No expense data available
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: isMobile ? 1.5 : 2,
                                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                        height: isMobile ? 'auto' : '100%',
                                        mt: isMobile ? 2 : 0
                                    }}
                                >
                                    <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 2, fontWeight: 600, fontSize: isMobile ? '1rem' : undefined }}>
                                        Top Categories
                                    </Typography>

                                    <Stack spacing={isMobile ? 1.2 : 2}>
                                        {topCategories.map((category, index) => (
                                            <Box key={index}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.95rem' : undefined }}>
                                                        {category.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: isMobile ? '0.95rem' : undefined }}>
                                                        ₱{category.value.toFixed(2)}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ width: '100%', height: 8, borderRadius: 4, bgcolor: alpha(theme.palette.divider, 0.2) }}>
                                                    <Box
                                                        sx={{
                                                            height: '100%',
                                                            borderRadius: 4,
                                                            width: `${(category.value / highestExpenseCategory.value) * 100}%`,
                                                            bgcolor: COLORS[index % COLORS.length]
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>

                                    {expensesByCategory.length > 5 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Divider sx={{ mb: 1.5 }} />
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: isMobile ? '0.9rem' : undefined }}>
                                                {expensesByCategory.length - 5} more categories not shown
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Card>
                )}

                {activeTab === 1 && (
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            backdropFilter: isMobile ? undefined : "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            p: {
                                xs: 1.5,
                                sm: 2
                            },
                            borderRadius: { xs: 2, sm: 3 },
                            boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.04)' : undefined,
                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            justifyContent: "space-between",
                            alignItems: isMobile ? "flex-start" : "center",
                            mb: isMobile ? 1 : 2,
                            px: isMobile ? 0 : 1
                        }}>
                            <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : undefined }}>
                                Monthly Expense Trends
                            </Typography>
                            <Tooltip title="Shows your expense trends over the past 6 months">
                                <IconButton size="small" sx={{ mt: isMobile ? 0.5 : 0 }}>
                                    <InfoIcon fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {monthlyExpenseData.length > 0 ? (
                            <Box sx={{
                                height: { xs: 220, sm: 350, md: 400 },
                                pb: isMobile ? 1 : 0,
                                mx: isMobile ? -1.5 : 0
                            }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={monthlyExpenseData}
                                        margin={{
                                            top: isMobile ? 10 : 20,
                                            right: isMobile ? 2 : 30,
                                            left: isMobile ? 2 : 20,
                                            bottom: isMobile ? 0 : 5
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.25)} />
                                        <XAxis
                                            dataKey="month"
                                            tick={{
                                                fill: theme.palette.text.secondary,
                                                fontSize: isMobile ? 9 : 12,
                                                fontWeight: 500
                                            }}
                                            angle={isMobile ? -35 : 0}
                                            textAnchor={isMobile ? 'end' : 'middle'}
                                            height={isMobile ? 38 : 30}
                                            interval={0}
                                        />
                                        <YAxis
                                            tick={{
                                                fill: theme.palette.text.secondary,
                                                fontSize: isMobile ? 9 : 12
                                            }}
                                            tickFormatter={(value) => isMobile ? `₱${(value / 1000).toFixed(0)}k` : `₱${value}`}
                                            width={isMobile ? 32 : 60}
                                        />
                                        <RechartsTooltip
                                            formatter={(value) => `₱${value}`}
                                            contentStyle={{
                                                backgroundColor: alpha(theme.palette.background.paper, 0.97),
                                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                                borderRadius: 8,
                                                fontSize: isMobile ? 11 : 14,
                                                boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
                                            }}
                                        />
                                        {!isMobile && <Legend />}
                                        <Bar
                                            dataKey="amount"
                                            name="Total Expenses"
                                            fill={theme.palette.primary.main}
                                            radius={isMobile ? [3, 3, 0, 0] : [4, 4, 0, 0]}
                                            barSize={isMobile ? 18 : undefined}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <Box sx={{ height: { xs: 220, sm: 350, md: 400 }, display: 'flex', alignItems: 'center', justifyContent: 'center', px: isMobile ? 1 : 0 }}>
                                <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.95rem', md: '1.25rem' }, textAlign: 'center' }}>
                                    No expense data available
                                </Typography>
                            </Box>
                        )}
                    </Card>
                )}

                {activeTab === 2 && (
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            backdropFilter: isMobile ? undefined : "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            p: {
                                xs: 1.5,
                                sm: 2
                            },
                            borderRadius: { xs: 2, sm: 3 },
                            boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.04)' : undefined,
                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            justifyContent: "space-between",
                            alignItems: isMobile ? "flex-start" : "center",
                            mb: isMobile ? 1 : 2,
                            px: isMobile ? 0 : 1
                        }}>
                            <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : undefined }}>
                                Daily Spending Patterns
                            </Typography>
                            <Tooltip title="Shows your daily spending patterns over the past 14 days">
                                <IconButton size="small" sx={{ mt: isMobile ? 0.5 : 0 }}>
                                    <InfoIcon fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {dailyExpenseData.length > 0 ? (
                            <Box sx={{
                                height: { xs: 220, sm: 350, md: 400 },
                                pb: isMobile ? 1 : 0,
                                mx: isMobile ? -1.5 : 0
                            }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={dailyExpenseData}
                                        margin={{
                                            top: isMobile ? 10 : 20,
                                            right: isMobile ? 2 : 30,
                                            left: isMobile ? 2 : 20,
                                            bottom: isMobile ? 0 : 5
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.25)} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{
                                                fill: theme.palette.text.secondary,
                                                fontSize: isMobile ? 9 : 12,
                                                fontWeight: 500
                                            }}
                                            angle={isMobile ? -35 : 0}
                                            textAnchor={isMobile ? 'end' : 'middle'}
                                            height={isMobile ? 38 : 30}
                                            interval={0}
                                        />
                                        <YAxis
                                            tick={{
                                                fill: theme.palette.text.secondary,
                                                fontSize: isMobile ? 9 : 12
                                            }}
                                            tickFormatter={(value) => isMobile ? `₱${(value / 1000).toFixed(0)}k` : `₱${value}`}
                                            width={isMobile ? 32 : 60}
                                        />
                                        <RechartsTooltip
                                            formatter={(value) => `₱${value}`}
                                            contentStyle={{
                                                backgroundColor: alpha(theme.palette.background.paper, 0.97),
                                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                                borderRadius: 8,
                                                fontSize: isMobile ? 11 : 14,
                                                boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
                                            }}
                                        />
                                        {!isMobile && <Legend />}
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            name="Daily Expenses"
                                            stroke={theme.palette.success.main}
                                            strokeWidth={isMobile ? 1.5 : 2}
                                            dot={{ r: isMobile ? 2 : 4, fill: theme.palette.success.main }}
                                            activeDot={{ r: isMobile ? 4 : 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <Box sx={{ height: { xs: 220, sm: 350, md: 400 }, display: 'flex', alignItems: 'center', justifyContent: 'center', px: isMobile ? 1 : 0 }}>
                                <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.95rem', md: '1.25rem' }, textAlign: 'center' }}>
                                    No expense data available
                                </Typography>
                            </Box>
                        )}
                    </Card>
                )}

                {activeTab === 3 && (
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            backdropFilter: isMobile ? undefined : "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            p: {
                                xs: 1.5,
                                sm: 2
                            },
                            borderRadius: { xs: 2, sm: 3 },
                            boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.04)' : undefined,
                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            justifyContent: "space-between",
                            alignItems: isMobile ? "flex-start" : "center",
                            mb: isMobile ? 1 : 2,
                            px: isMobile ? 0 : 1
                        }}>
                            <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : undefined }}>
                                Spending by Day of Week
                            </Typography>
                            <Tooltip title="Shows your spending patterns by day of the week">
                                <IconButton size="small" sx={{ mt: isMobile ? 0.5 : 0 }}>
                                    <InfoIcon fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {spendingByDayOfWeek.some(day => day.total > 0) ? (
                            <Grid container spacing={isMobile ? 1.5 : 3} direction={isMobile ? 'column' : 'row'}>
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Box sx={{ height: { xs: 220, sm: 350, md: 400 }, mx: isMobile ? -1.5 : 0 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={spendingByDayOfWeek}
                                                margin={{
                                                    top: isMobile ? 10 : 20,
                                                    right: isMobile ? 2 : 30,
                                                    left: isMobile ? 2 : 20,
                                                    bottom: isMobile ? 0 : 5
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.25)} />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: isMobile ? 9 : 12, fontWeight: 500 }}
                                                    angle={isMobile ? -35 : 0}
                                                    textAnchor={isMobile ? 'end' : 'middle'}
                                                    height={isMobile ? 38 : 30}
                                                    interval={0}
                                                />
                                                <YAxis
                                                    tickFormatter={(value) => isMobile ? `₱${(value / 1000).toFixed(0)}k` : `₱${value}`}
                                                    tick={{ fill: theme.palette.text.secondary, fontSize: isMobile ? 9 : 12 }}
                                                    width={isMobile ? 32 : 60}
                                                />
                                                <RechartsTooltip
                                                    formatter={(value: number) => `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                    contentStyle={{
                                                        backgroundColor: alpha(theme.palette.background.paper, 0.97),
                                                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                                        borderRadius: 8,
                                                        fontSize: isMobile ? 11 : 14,
                                                        boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
                                                    }}
                                                />
                                                {!isMobile && <Legend />}
                                                <Bar
                                                    dataKey="total"
                                                    name="Total Spent"
                                                    fill={theme.palette.warning.main}
                                                    radius={isMobile ? [3, 3, 0, 0] : [4, 4, 0, 0]}
                                                    barSize={isMobile ? 18 : undefined}
                                                />
                                                <Bar
                                                    dataKey="average"
                                                    name="Average per Transaction"
                                                    fill={theme.palette.info.main}
                                                    radius={isMobile ? [3, 3, 0, 0] : [4, 4, 0, 0]}
                                                    barSize={isMobile ? 18 : undefined}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: isMobile ? 1.5 : 2,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                            height: isMobile ? 'auto' : '100%',
                                            mt: isMobile ? 2 : 0
                                        }}
                                    >
                                        <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 2, fontWeight: 600, fontSize: isMobile ? '1rem' : undefined }}>
                                            Day of Week Insights
                                        </Typography>

                                        {highestSpendingDay.name && (
                                            <Box sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Highest Spending Day:
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        {highestSpendingDay.name}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Total Amount:
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        ₱{highestSpendingDay.total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </Typography>
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                                                    Transaction Count by Day
                                                </Typography>

                                                {spendingByDayOfWeek.map((day, index) => (
                                                    day.count > 0 ? (
                                                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Typography variant="body2">
                                                                {day.name}:
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {day.count} transactions
                                                            </Typography>
                                                        </Box>
                                                    ) : null
                                                ))}
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        ) : (
                            <Box sx={{ height: { xs: 220, sm: 350, md: 400 }, display: 'flex', alignItems: 'center', justifyContent: 'center', px: isMobile ? 1 : 0 }}>
                                <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.95rem', md: '1.25rem' }, textAlign: 'center' }}>
                                    No expense data available for day-of-week analysis
                                </Typography>
                            </Box>
                        )}
                    </Card>
                )}
            </Box>

            {/* Bottom Grid - Insights & Recommendations */}
            <Grid container spacing={3}>
                {/* Spending Insights Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            height: '100%'
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                                <InfoIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                Spending Insights
                            </Typography>

                            <Stack spacing={3}>
                                {highestExpenseCategory.name !== "None" && (
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                                            Highest Spending Category
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    bgcolor: COLORS[0],
                                                    mr: 1
                                                }}
                                            />
                                            <Typography variant="body2">
                                                {highestExpenseCategory.name}: ₱{highestExpenseCategory.value.toFixed(2)}
                                                ({((highestExpenseCategory.value / totalExpense) * 100).toFixed(1)}% of total)
                                            </Typography>
                                        </Box>
                                        <Chip
                                            size="small"
                                            label={`${((highestExpenseCategory.value / totalExpense) * 100).toFixed(1)}%`}
                                            sx={{ bgcolor: COLORS[0], color: '#fff' }}
                                        />
                                    </Box>
                                )}

                                {highestSpendingDay.name && (
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                                            Highest Spending Day
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    bgcolor: COLORS[1],
                                                    mr: 1
                                                }}
                                            />
                                            <Typography variant="body2">
                                                {highestSpendingDay.name}: ₱{highestSpendingDay.total.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            size="small"
                                            label={`${highestSpendingDay.name}`}
                                            sx={{ bgcolor: COLORS[1], color: '#fff' }}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Month-over-Month Analysis Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            height: '100%'
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                                <LightbulbIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                                Month-over-Month Analysis
                            </Typography>

                            {monthlyExpenseData.length >= 2 ? (
                                <Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        mb: 3,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: alpha(
                                            monthOverMonthChange.isIncrease ?
                                                theme.palette.error.main :
                                                theme.palette.success.main,
                                            0.1
                                        ),
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            {monthOverMonthChange.isIncrease ? (
                                                <TrendingUpIcon sx={{
                                                    fontSize: 40,
                                                    color: theme.palette.error.main,
                                                    mr: 1
                                                }} />
                                            ) : (
                                                <TrendingDownIcon sx={{
                                                    fontSize: 40,
                                                    color: theme.palette.success.main,
                                                    mr: 1
                                                }} />
                                            )}
                                            <Typography variant="h4" sx={{
                                                fontWeight: 700,
                                                color: monthOverMonthChange.isIncrease ?
                                                    theme.palette.error.main :
                                                    theme.palette.success.main
                                            }}>
                                                {(monthOverMonthChange.percentage ?? 0).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                            {monthOverMonthChange.isIncrease ?
                                                "Spending increased by " :
                                                "Spending decreased by "}
                                            ₱{monthOverMonthChange.value.toLocaleString('en-PH',
                                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })} compared to last month
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            Current Month:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            ₱{monthlyExpenseData[monthlyExpenseData.length - 1].amount.toLocaleString('en-PH',
                                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            Previous Month:
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            ₱{monthlyExpenseData[monthlyExpenseData.length - 2].amount.toLocaleString('en-PH',
                                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                        Not enough data for month-over-month comparison
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Day of Week Analysis Card */}
                <Grid size={{ xs: 12, md: 12 }}>
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            p: { xs: 1, sm: 2 },
                            mt: 2
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 1, sm: 2 } }}>
                            <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, fontSize: isMobile ? '1.05rem' : undefined }}>
                                Spending by Day of Week
                            </Typography>
                            <Tooltip title="Shows your spending patterns by day of the week">
                                <IconButton size="small">
                                    <InfoIcon fontSize={isMobile ? "small" : "medium"} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {spendingByDayOfWeek.some(day => day.total > 0) ? (
                            <Box sx={{ height: { xs: 200, sm: 300 }, mt: { xs: 1, sm: 2 } }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={spendingByDayOfWeek}
                                        margin={{ top: isMobile ? 5 : 10, right: isMobile ? 5 : 30, left: isMobile ? 5 : 20, bottom: isMobile ? 0 : 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: theme.palette.text.secondary, fontSize: isMobile ? 10 : 12, fontWeight: 500 }}
                                            angle={isMobile ? -35 : 0}
                                            textAnchor={isMobile ? 'end' : 'middle'}
                                            height={isMobile ? 38 : 30}
                                            interval={0}
                                        />
                                        <YAxis
                                            tickFormatter={(value) => isMobile ? `₱${(value / 1000).toFixed(0)}k` : `₱${value}`}
                                            tick={{ fill: theme.palette.text.secondary, fontSize: isMobile ? 10 : 12 }}
                                            width={isMobile ? 32 : 60}
                                        />
                                        <RechartsTooltip
                                            formatter={(value: number) => `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            contentStyle={{
                                                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                                borderRadius: 8,
                                                fontSize: isMobile ? 11 : 14,
                                                boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
                                            }}
                                        />
                                        {!isMobile && <Legend />}
                                        <Bar
                                            dataKey="total"
                                            name="Total Spent"
                                            fill={theme.palette.warning.main}
                                            radius={isMobile ? [3, 3, 0, 0] : [4, 4, 0, 0]}
                                            barSize={isMobile ? 18 : undefined}
                                        />
                                        <Bar
                                            dataKey="average"
                                            name="Average per Transaction"
                                            fill={theme.palette.info.main}
                                            radius={isMobile ? [3, 3, 0, 0] : [4, 4, 0, 0]}
                                            barSize={isMobile ? 18 : undefined}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <Box sx={{ height: { xs: 200, sm: 300 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: theme.palette.text.secondary, fontSize: isMobile ? '0.95rem' : undefined }}>
                                    No expense data available for day-of-week analysis
                                </Typography>
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Analytics;