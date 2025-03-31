import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React from 'react';
import Quiz from './pages/Quiz';
import ProfilePage from './pages/Profile';
import Dashboard from './pages/Home';


const router = createBrowserRouter([
  { path: "/profile", element: <ProfilePage /> },
  { path: "/Quiz", element: <Quiz /> },
  { path: "/", element: <Dashboard />}
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);