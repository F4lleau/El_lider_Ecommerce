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
import AdminLayout from "../components/admin/AdminLayout";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminProductFormPage from "../pages/AdminProductFormPage";
import AdminCategoriesPage from "../pages/AdminCategoriesPage";
import AdminCategoryFormPage from "../pages/AdminCategoryFormPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/AdminOrderDetailPage";
import AdminStockRequestsPage from "../pages/AdminStockRequestsPage";

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
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: <AdminRoute />,
    children: [{
      path: "admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <Navigate to="/admin/dashboard" replace /> },
        { path: "dashboard", element: <AdminDashboardPage /> },
        { path: "productos", element: <AdminProductsPage /> },
        { path: "productos/nuevo", element: <AdminProductFormPage /> },
        { path: "productos/:id/editar", element: <AdminProductFormPage /> },
        { path: "categorias", element: <AdminCategoriesPage /> },
        { path: "categorias/nueva", element: <AdminCategoryFormPage /> },
        { path: "categorias/:id/editar", element: <AdminCategoryFormPage /> },
        { path: "pedidos", element: <AdminOrdersPage /> },
        { path: "pedidos/:id", element: <AdminOrderDetailPage /> },
        { path: "solicitudes-stock", element: <AdminStockRequestsPage /> },
      ],
    }],
  },
]);
