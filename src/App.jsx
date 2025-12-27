import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Menu from "./pages/home/Menu";
import CartPage from "./pages/cart/CartPage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Checkout from "./pages/cart/Checkout";
import OrderSuccess from "./pages/orders/OrderSuccess";
import OrderTracking from "./pages/orders/OrderTracking";
import Orders from "./pages/orders/Orders";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import AdminOrderDetails from "./pages/admin/orders/AdminOrderDetails";
import AdminProducts from "./pages/admin/products/AdminProducts";
import AdminPromo from "./pages/admin/promo/AdminPromo";
import AboutUs from "./pages/info/AboutUs";
import ContactUs from "./pages/info/ContactUs";
import FAQs from "./pages/info/FAQs";
import TermsConditions from "./pages/info/TermsConditions";
import DataProtection from "./pages/info/DataProtection";
import Profile from "./pages/profile/Profile";
import NotFound from "./NotFound";
import PrivateRoute from "./PrivateRoute";
import RoleGuard from "./RoleGuard";

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.search]);
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Wrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/sign-up" element={<Layout><SignUp /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
          <Route path="/contact-us" element={<Layout><ContactUs /></Layout>} />
          <Route path="/faqs" element={<Layout><FAQs /></Layout>} />
          <Route path="/terms-conditions" element={<Layout><TermsConditions /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><DataProtection /></Layout>} />

          {/* Protected Customer Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout><Profile /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Layout><CartPage /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Layout><Checkout /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Layout><Orders /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <PrivateRoute>
                <Layout><OrderSuccess /></Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/order/:orderId"
            element={
              <PrivateRoute>
                <Layout><OrderTracking /></Layout>
              </PrivateRoute>
            }
          />

          {/* Admin Login - Public */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <RoleGuard requiredRole={["admin"]}>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </RoleGuard>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <PrivateRoute>
                <RoleGuard requiredRole={["admin"]}>
                  <AdminLayout><AdminOrders /></AdminLayout>
                </RoleGuard>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/orders/:orderId"
            element={
              <PrivateRoute>
                <RoleGuard requiredRole={["admin"]}>
                  <AdminLayout><AdminOrderDetails /></AdminLayout>
                </RoleGuard>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <PrivateRoute>
                <RoleGuard requiredRole={["admin"]}>
                  <AdminLayout><AdminProducts /></AdminLayout>
                </RoleGuard>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/promos"
            element={
              <PrivateRoute>
                <RoleGuard requiredRole={["admin"]}>
                  <AdminLayout><AdminPromo /></AdminLayout>
                </RoleGuard>
              </PrivateRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
