import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import Menu from './Menu';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Countries Explorer</Link>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="text-xl">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={toggleMenu} className="md:hidden text-xl">
            <FaBars />
          </button>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            {user ? (
              <>
                <Link to="/favorites" className="hover:underline">Favorites</Link>
                <button onClick={handleLogout} className="hover:underline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/signup" className="hover:underline">Signup</Link>
              </>
            )}
          </nav>
        </div>
      </div>
      {isMenuOpen && <Menu toggleMenu={toggleMenu} />}
    </header>
  );
};

export default Header;