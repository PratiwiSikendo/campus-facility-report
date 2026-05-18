import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateReport from './pages/CreateReport';
import MyReports from './pages/MyReports';
import AdminDashboard from './pages/AdminDashboard';
import PetugasDashboard from './pages/PetugasDashboard';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'ADMIN' ? children : <Navigate to="/" />;
}

function PetugasRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'PETUGAS' ? children : <Navigate to="/" />;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user?.role === 'PETUGAS') return <Navigate to="/petugas" replace />;
  return <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/laporan/buat" element={<PrivateRoute><CreateReport /></PrivateRoute>} />
              <Route path="/laporan/saya" element={<PrivateRoute><MyReports /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/petugas" element={<PetugasRoute><PetugasDashboard /></PetugasRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}