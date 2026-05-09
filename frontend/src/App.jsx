import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateReport from './pages/CreateReport';
import MyReports from './pages/MyReports';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'ADMIN' || user?.role === 'PETUGAS'
    ? children
    : <Navigate to="/" />;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return null; // ← tunggu dulu sampai auth selesai load
  if (user?.role === 'ADMIN' || user?.role === 'PETUGAS') {
    return <Navigate to="/admin" replace />;
  }
  return <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/laporan/buat" element={<PrivateRoute><CreateReport /></PrivateRoute>} />
          <Route path="/laporan/saya" element={<PrivateRoute><MyReports /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}