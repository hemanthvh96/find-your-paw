import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "@/features/auth/LoginPage";
import Layout from "./Layout";
import NotFoundPage from "@/pages/NotFoundPage";
import SearchPage from "@/features/search/SearchPage";
import FavoritesPage from "@/features/favorites/FavoritesPage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/search" replace /> },
      {
        path: "search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
