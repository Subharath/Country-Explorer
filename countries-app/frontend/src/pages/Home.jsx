import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CountryCard from '../components/CountryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        setCountries(response.data);
        setFilteredCountries(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    let result = [...countries];

    if (search) {
      result = result.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (region) {
      result = result.filter(country => country.region === region);
    }

    if (language) {
      result = result.filter(country =>
        Object.values(country.languages || {}).includes(language)
      );
    }

    result.sort((a, b) => {
      const nameA = a.name.common.toLowerCase();
      const nameB = b.name.common.toLowerCase();
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    setFilteredCountries(result);
  }, [search, region, language, sortOrder, countries]);

  const regions = [...new Set(countries.map(country => country.region))].filter(Boolean);
  const languages = [...new Set(countries.flatMap(country => Object.values(country.languages || {})))];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Explore Countries</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
            <input
              type="text"
              placeholder="Search by country name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Region</label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Regions</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Languages</option>
              {languages.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="asc">Sort A-Z</option>
              <option value="desc">Sort Z-A</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-4 mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          {filteredCountries.length} {filteredCountries.length === 1 ? 'Country' : 'Countries'} Found
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCountries.map(country => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>
    </div>
  );
};

export default Home;