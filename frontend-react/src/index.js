import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React from 'react';
import Quiz from './pages/Quiz';
import ProfilePage from './pages/Profile';
import Dashboard from './pages/Home';
import AddQs from "./pages/AddQuestions";
import Login from "./pages/Login";


const router = createBrowserRouter([
  { path: "/profile", element: <ProfilePage /> },
  { path: "/quiz", element: <Quiz /> },
  { path: "/home", element: <Dashboard />},
  { path: "/add-questions", element: <AddQs />},
  { path: "/", element: <Login /> }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);