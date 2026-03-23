import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/Index";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProductsCategories from "../pages/ProductsPage";
import OffersPage from "../pages/OffersPage";
import AboutPage from "@/pages/AboutPage";
import CartPage from "../pages/CartPage";
import BestSellersPage from "../pages/BestSellersPage";
import NotFoundPage from "@/pages/NotFoundPage";
export const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout><HomePage /></MainLayout>,
	},
	{
		path: "/productos",
		element: <MainLayout><ProductsCategories /></MainLayout>,
	},
	{
		path: "/ofertas",
		element: <MainLayout><OffersPage /></MainLayout>,
	},
	{
		path: "/nosotros",
		element: <MainLayout><AboutPage /></MainLayout>,
	},
	{
		path: "/login",
		element: <MainLayout><LoginPage /></MainLayout>,
	},
	{
		path: "/registro",
		element: <MainLayout><RegisterPage /></MainLayout>,
	},
	{
		path: "/carrito",
		element: <MainLayout><CartPage /></MainLayout>,
	},
	{
		path: "/mas-vendidos",
		element: <MainLayout><BestSellersPage /></MainLayout>,
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
