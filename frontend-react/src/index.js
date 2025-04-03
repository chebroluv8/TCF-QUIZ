import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React from 'react';
import Quiz from './pages/Quiz';
import ProfilePage from './pages/Profile';
import Dashboard from './pages/Home';
import AddQs from "./pages/AddQuestions";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import CreateSet from "./pages/CreateSet";
import PrivacyPolicy from './pages/PrivacyPolicy';
import './index.css';


const router = createBrowserRouter([
  { path: "/profile", element: <ProfilePage /> },
  { path: "/quiz/:setId", element: <Quiz /> },
  { path: "/home", element: <Dashboard />},
  { path: "/add-questions/:setId", element: <AddQs />},
  { path: "/create-account", element: <CreateAccount />},
  { path: "/create-set", element: <CreateSet /> },
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);