import { Route, Routes } from "react-router-dom";
import Privacy from "./Components/privacy/Privacy";
import Home from "./Components/home/Home";
import Terms from "./Components/terms/Terms";
import Return from "./Components/return/Return";
import Payment from "./Components/payment/Payment";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminLayout from "./Components/AdminLayout";
import AdminDashboard from "./Components/AdminDashboard";
import AdminPayments from "./Components/AdminPayments";
import AdminUploads from "./Components/AdminUploads";
import AdminLogin from "./Components/AdminLogin";
import PaymentStatus from "./Components/PaymentStatus/PaymentStatus";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/return" element={<Return />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/payment/status" element={<PaymentStatus />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminPayments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/uploads"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminUploads />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
