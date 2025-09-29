import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPageClean from "./pages/LoginPage";
import MessagesListPage from "./pages/MessagesListPage";
import MessageFormPage from "./pages/MessageFormPage";
import MessageDetailPage from "./pages/MessageDetailPage";

function App() {
  const isAuthenticated = !!localStorage.getItem("authToken");

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
