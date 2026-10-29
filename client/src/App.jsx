import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import BrowseItems from './pages/BrowseItems.jsx';
import ItemDetails from './pages/ItemDetails.jsx';
import ReportLostItem from './pages/ReportLostItem.jsx';
import ReportFoundItem from './pages/ReportFoundItem.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import UserDashboard from './pages/dashboard/UserDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<BrowseItems />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route
                path="/report-lost"
                element={
                  <ProtectedRoute>
                    <ReportLostItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report-found"
                element={
                  <ProtectedRoute>
                    <ReportFoundItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Administrator & Campus Moderator Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole={['admin', 'moderator']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
