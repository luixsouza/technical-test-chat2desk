import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPageClean from "./pages/LoginPage";
import MessagesListPage from "./pages/MessagesListPage";
import MessageFormPage from "./pages/MessageFormPage";
import MessageDetailPage from "./pages/MessageDetailPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há token válido no localStorage
    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken");

      // Se não há token ou está vazio, não está autenticado
      if (
        !authToken ||
        authToken.trim() === "" ||
        authToken === "null" ||
        authToken === "undefined"
      ) {
        setIsAuthenticated(false);
        localStorage.removeItem("authToken"); // Limpa token inválido
      } else {
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Listener para mudanças no localStorage (para logout de outras abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPageClean />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <MessagesListPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/messages/new"
          element={
            isAuthenticated ? <MessageFormPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/messages/:id/edit"
          element={
            isAuthenticated ? <MessageFormPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/messages/:id"
          element={
            isAuthenticated ? <MessageDetailPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
