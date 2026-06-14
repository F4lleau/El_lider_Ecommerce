import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProductsPage from "../pages/ProductsPage";
import OffersPage from "../pages/OffersPage";
import AboutPage from "../pages/AboutPage";
import AboutAddressPage from "../pages/AboutAddressPAge";
import AboutContactPage from "../pages/AboutContactPage";
import CartPage from "../pages/CartPage";
import BestSellersPage from "../pages/BestSellersPage";
import NotFoundPage from "../pages/NotFoundPage";
import AppLayout from "./layout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { AdminRoute } from "../components/auth/AdminRoute";
import AccountPage from "../pages/AccountPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AccessDeniedPage from "../pages/AccessDeniedPage";
import CheckoutPage from "../pages/CheckoutPage";
import CheckoutConfirmationPage from "../pages/CheckoutConfirmationPage";
import OrderTrackingPage from "../pages/OrderTrackingPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import MyOrderDetailPage from "../pages/MyOrderDetailPage";
import TrackingSearchPage from "../pages/TrackingSearchPage";

const RootLayout = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "productos", element: <ProductsPage /> },
      { path: "productos/categorias", element: <ProductsPage /> },
      { path: "productos/ofertas", element: <OffersPage /> },
      { path: "productos/mas-vendidos", element: <BestSellersPage /> },
      {
        path: "ofertas",
        element: <Navigate to="/productos/ofertas" replace />,
      },
      { path: "nosotros", element: <AboutPage /> },
      { path: "nosotros/direccion", element: <AboutAddressPage /> },
      { path: "nosotros/contacto", element: <AboutContactPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "registro", element: <RegisterPage /> },
      { path: "carrito", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "checkout/confirmacion", element: <CheckoutConfirmationPage /> },
      { path: "pedido/:trackingCode", element: <OrderTrackingPage /> },
      { path: "seguimiento", element: <TrackingSearchPage /> },
      { path: "acceso-denegado", element: <AccessDeniedPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "mi-cuenta", element: <AccountPage /> },
          { path: "mi-cuenta/pedidos", element: <MyOrdersPage /> },
          { path: "mi-cuenta/pedidos/:id", element: <MyOrderDetailPage /> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          { path: "admin", element: <Navigate to="/admin/dashboard" replace /> },
          { path: "admin/dashboard", element: <AdminDashboardPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
