import type React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import type { RouteObject } from "react-router-dom"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import { ThemeProvider } from "./context/ThemeContext"
import { UserProvider } from "./context/UserContext"
import LandingPageLayout from "./layouts/LandingPageLayout"
import DashboardLayout from "./layouts/DashboardLayout"
import BudgetPlannerLanding from "./pages/BudgetPlannerLanding"
import Expenses from "./pages/Expenses"
import Settings from "./pages/Settings"
import ProtectedRoute from "./components/ProtectedRoute"

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPageLayout />,
    children: [
      { index: true, element: <BudgetPlannerLanding /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "expenses", element: <Expenses /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]

const router = createBrowserRouter(routes)

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
