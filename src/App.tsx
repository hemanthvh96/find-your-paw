import { RouterProvider } from "react-router";
import router from "@/routes/router";
import { AuthProvider } from "@/features/auth/AuthContext";
import { FavoritesProvider } from "./features/favorites/FavoritesContext";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <RouterProvider router={router}></RouterProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
