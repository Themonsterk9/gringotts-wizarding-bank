import { Routes, Route } from "react-router-dom";
import { MagicalBackground } from "./components/animationHome";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Deposit from "./pages/Deposit/Deposit";
import Withdraw from "./pages/Withdraw/Withdraw";
import Transfer from "./pages/Transfer/Transfer";
import Transactions from "./pages/Transactions/Transactions";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import Settings from "./pages/Settings/Settings";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import VerifyOTP from "./pages/VerifyOTP/VerifyOTP";
import Security from "./pages/Security/Security";


import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
  <>
    <MagicalBackground />

    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/deposit"
        element={
          <ProtectedRoute>
            <Deposit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/withdraw"
        element={
          <ProtectedRoute>
            <Withdraw />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transfer"
        element={
          <ProtectedRoute>
            <Transfer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
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
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />

      <Route
  path="/security"
  element={
    <ProtectedRoute>
      <Security />
    </ProtectedRoute>
  }
/>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);
}

export default App;