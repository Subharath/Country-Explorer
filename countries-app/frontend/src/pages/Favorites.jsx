import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import CountryCard from '../components/CountryCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const [favoritesResponse, countriesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/favorites', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get('https://restcountries.com/v3.1/all'),
        ]);
        setFavorites(favoritesResponse.data.favorites);
        setCountries(countriesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  const favoriteCountries = countries.filter(country =>
    favorites.includes(country.cca3)
  );

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Favorites</h2>
        <p>Please log in to view your favorite countries.</p>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Favorite Countries</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition duration-200"
        >
          ← Back
        </button>
      </div>

      {favoriteCountries.length === 0 ? (
        <p>No favorite countries added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteCountries.map(country => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
