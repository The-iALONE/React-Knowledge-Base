// Examples/react-router/ProtectedRoute.jsx
// مستندات: React-Router/Navigation.md — الگوی Wild Oasis
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = {
    user,
    isAuthenticated: Boolean(user),
    login: () => setUser({ role: "authenticated" }),
    logout: () => setUser(null),
  };
  return <UserContext value={value}>{children}</UserContext>;
}

function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser outside UserProvider");
  return ctx;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function Login() {
  const { login } = useUser();
  const navigate = useNavigate();
  return (
    <div>
      <h1>Login</h1>
      <button
        type="button"
        onClick={() => {
          login();
          navigate("/dashboard", { replace: true });
        }}
      >
        Sign in
      </button>
    </div>
  );
}

function Dashboard() {
  return <h1>Dashboard (protected)</h1>;
}

function AppLayout() {
  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
