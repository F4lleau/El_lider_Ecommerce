import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProductsPage from "../pages/ProductsPage";
import OffersPage from "../pages/OffersPage";
import AboutPage from "../pages/AboutPage";
import CartPage from "../pages/CartPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
	{ path: "/", element: <HomePage /> },
	{ path: "/productos", element: <ProductsPage /> },
	{ path: "/ofertas", element: <OffersPage /> },
	{ path: "/nosotros", element: <AboutPage /> },
	{ path: "/login", element: <LoginPage /> },
	{ path: "/registro", element: <RegisterPage /> },
	{ path: "/carrito", element: <CartPage /> },
	{ path: "*", element: <NotFoundPage /> },
]);
