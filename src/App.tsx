import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { ThemeProvider } from './context/ThemeContext';
import LandingPageLayout from './layouts/LandingPageLayout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
    ],
  },
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
