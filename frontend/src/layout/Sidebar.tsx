import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaUser,
  FaSignInAlt,
  FaShoppingCart,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const menu = [
  { label: "Inicio", icon: <FaHome />, to: "/" },
  {
    label: "Productos",
    icon: <FaBoxOpen />,
    submenu: [
      { label: "Todos", to: "/productos" },
      // Agrega más submenús si es necesario
    ],
  },
  {
    label: "Quiénes Somos",
    icon: <FaUser />,
    submenu: [
      { label: "Nosotros", to: "/quienes-somos" },
      // Agrega más submenús si es necesario
    ],
  },
  { label: "Registro", icon: <FaUser />, to: "/registro" },
  { label: "Iniciar Sesión", icon: <FaSignInAlt />, to: "/login" },
  { label: "Carrito", icon: <FaShoppingCart />, to: "/carrito" },
];

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const toggleMenu = (idx: number) => {
    setOpenMenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <aside
      className={`bg-white h-full shadow-md transition-all duration-300 ${collapsed ? "w-16" : "w-60"} fixed z-20`}
    >
      <nav className="flex flex-col gap-2 p-4">
        {menu.map((item, idx) => (
          <div key={item.label}>
            {item.submenu ? (
              <button
                className="flex items-center w-full gap-2 p-2 rounded hover:bg-gray-100 focus:outline-none"
                onClick={() => toggleMenu(idx)}
              >
                <span>{item.icon}</span>
                {!collapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
                {!collapsed &&
                  (openMenus[idx] ? <FaChevronUp /> : <FaChevronDown />)}
              </button>
            ) : (
              <Link
                to={item.to!}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )}
            {item.submenu && openMenus[idx] && !collapsed && (
              <div className="ml-8 flex flex-col gap-1">
                {item.submenu.map((sub) => (
                  <Link
                    key={sub.label}
                    to={sub.to}
                    className="p-1 hover:underline"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
