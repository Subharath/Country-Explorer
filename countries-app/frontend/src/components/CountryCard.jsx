import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const CountryCard = ({ country }) => {
  const { user } = useContext(AuthContext);

  const handleFavorite = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/favorites/add',
        { countryCode: country.cca3 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      window.alert(response.data.message || 'Added to favorites');
    } catch (error) {
      window.alert('Failed to add to favorites: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md rounded-lg p-4">
      <img src={country.flags.png} alt={country.name.common} className="w-full h-40 object-cover rounded" />
      <h3 className="text-xl font-semibold mt-2">{country.name.common}</h3>
      <p>Capital: {country.capital?.[0] || 'N/A'}</p>
      <p>Population: {country.population.toLocaleString()}</p>
      <p>Region: {country.region}</p>
      <div className="mt-4 flex space-x-2">
        <Link to={`/country/${country.cca3}`} className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-800">
          Details
        </Link>
        {user && (
          <button onClick={handleFavorite} className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-800">
            Favorite
          </button>
        )}
      </div>
    </div>
  );
};

export default CountryCard;