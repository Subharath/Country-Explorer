import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Menu = ({ toggleMenu }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toggleMenu();
  };

  return (
    <div className="md:hidden bg-blue-600 dark:bg-blue-800 text-white p-4">
      <nav className="flex flex-col space-y-2">
        <Link to="/" onClick={toggleMenu} className="hover:underline">Home</Link>
        {user ? (
          <>
            <Link to="/favorites" onClick={toggleMenu} className="hover:underline">Favorites</Link>
            <button onClick={handleLogout} className="text-left hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={toggleMenu} className="hover:underline">Login</Link>
            <Link to="/signup" onClick={toggleMenu} className="hover:underline">Signup</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Menu;