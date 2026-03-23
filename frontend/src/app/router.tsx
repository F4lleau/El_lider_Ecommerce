import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProductsPage from "../pages/ProductsPage";
import OffersPage from "../pages/OffersPage";
import AboutPage from "../pages/AboutPage";
import CartPage from "../pages/CartPage";
import BestSellersPage from "../pages/BestSellersPage";
import NotFoundPage from "../pages/NotFoundPage";

const RootLayout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
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
      { path: "nosotros", element: <AboutPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "registro", element: <RegisterPage /> },
      { path: "carrito", element: <CartPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
