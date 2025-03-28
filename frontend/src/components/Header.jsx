import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900">
            Banki
          </span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors group flex items-center"
          >
            Iniciar Sesión
            <ChevronRight
              className="ml-1 group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </Link>
        </nav>
      </div>
    </header>
  );
};
export default Header;
