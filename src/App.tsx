import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { ThemeProvider } from './context/ThemeContext';
import LandingPageLayout from './layouts/LandingPageLayout';
import DashboardLayout from './layouts/DashboardLayout';
import BudgetPlannerLanding from './pages/BudgetPlannerLanding';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      { index: true, element: <BudgetPlannerLanding /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
  }
];

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
