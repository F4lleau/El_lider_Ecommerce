import { FaBars, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header({
  onToggleSidebar,
  cartCount,
}: {
  onToggleSidebar: () => void;
  cartCount: number;
}) {
  return (
    <header className="flex items-center justify-between bg-white shadow px-4 h-16 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-xl hover:bg-gray-100 rounded"
        >
          <FaBars />
        </button>
        <Link to="/" className="font-bold text-lg flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <span className="hidden sm:inline">EL LÍDER</span>
        </Link>
      </div>
      <div className="flex-1 max-w-lg mx-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        />
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="relative p-2 text-xl hover:bg-gray-100 rounded"
        >
          <FaUser />
        </Link>
        <Link
          to="/carrito"
          className="relative p-2 text-xl hover:bg-gray-100 rounded"
        >
          <FaShoppingCart />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
