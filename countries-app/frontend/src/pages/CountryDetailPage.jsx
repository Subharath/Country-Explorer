import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const CountryDetailPage = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
        setCountry(response.data[0]);
        
        // Fetch border countries if available
        if (response.data[0].borders && response.data[0].borders.length > 0) {
          const borderCodes = response.data[0].borders.join(',');
          const bordersResponse = await axios.get(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`);
          setBorderCountries(bordersResponse.data);
        }
        
        // Optional: Fetch weather data for the capital if available
        if (response.data[0].capital && response.data[0].capital[0]) {
          try {
            // Note: This is a placeholder. In a real app, you would use a proper weather API
            setWeather({
              temperature: Math.floor(Math.random() * 30) + 5,
              condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)]
            });
          } catch (weatherError) {
            console.error('Weather data fetch error:', weatherError);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch country data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCountry();
  }, [code]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Error</h2>
        <p className="text-red-600 dark:text-red-200">{error}</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
          Return to Home
        </Link>
      </div>
    </div>
  );
  
  if (!country) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">Country Not Found</h2>
        <p className="text-yellow-600 dark:text-yellow-200">We couldn't find any country with the code "{code}".</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
          Explore All Countries
        </Link>
      </div>
    </div>
  );

  // Get additional data
  const languages = country.languages ? Object.values(country.languages) : [];
  const currencies = country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`) : [];
  const drivingSide = country.car?.side || 'N/A';
  const timeZones = country.timezones || [];
  const callingCode = country.idd?.root && country.idd?.suffixes?.[0] ? `${country.idd.root}${country.idd.suffixes[0]}` : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-2 bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-8 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Countries
        </Link>

        {/* Main Country Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2 p-6 flex flex-col items-center justify-center">
              <img 
                src={country.flags.svg} 
                alt={`Flag of ${country.name.common}`} 
                className="w-full max-w-md h-auto border border-gray-200 dark:border-gray-700 rounded-lg mb-6" 
              />
              
              {country.coatOfArms?.svg && (
                <div className="mt-6 text-center w-full">
                  <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Coat of Arms:</p>
                  <img 
                    src={country.coatOfArms.svg} 
                    alt="Coat of Arms" 
                    className="w-32 h-auto mx-auto border border-gray-300 dark:border-gray-600 rounded" 
                  />
                </div>
              )}
            </div>
            
            <div className="md:w-1/2 p-6">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{country.name.common}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Native Name:</span> {country.name.official}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Area:</span> {country.area?.toLocaleString()} km²</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Region:</span> {country.region}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Sub Region:</span> {country.subregion || 'N/A'}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Independent:</span> {country.independent ? 'Yes' : 'No'}</p>
                </div>
                
                <div>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Top Level Domain:</span> {country.tld?.join(', ') || 'N/A'}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Currencies:</span> {country.currencies && Object.values(country.currencies).map(c => c.name).join(', ')}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Languages:</span> {country.languages && Object.values(country.languages).join(', ')}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">UN Member:</span> {country.unMember ? 'Yes' : 'No'}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Start of the Week:</span> {country.startOfWeek}</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Google Maps:</span>{" "}
                    <a 
                      href={country.maps?.googleMaps} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:underline"
                    >
                      View on Map
                    </a>
                  </p>
                </div>
              </div>
              
              {/* Weather Info */}
              {weather && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">Weather in {country.capital?.[0]}</h3>
                  <p className="text-blue-600 dark:text-blue-200">
                    {weather.temperature}°C - {weather.condition}
                  </p>
                  <p className="text-xs text-blue-500 dark:text-blue-400">(Demo data)</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Additional Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Detailed Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-900 dark:text-white">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Languages</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {languages.length > 0 ? languages.map((lang, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded">
                        {lang}
                      </span>
                    )) : <span className="text-gray-600 dark:text-gray-300">No data available</span>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Currencies</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {currencies.length > 0 ? currencies.map((currency, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded">
                        {currency}
                      </span>
                    )) : <span className="text-gray-600 dark:text-gray-300">No data available</span>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Driving Side</h3>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white capitalize">{drivingSide}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Car Signs</h3>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{country.car?.signs?.join(', ') || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Zones</h3>
                  <div className="mt-1 grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {timeZones.length > 0 ? timeZones.map((timezone, index) => (
                      <span key={index} className="text-gray-900 dark:text-white text-sm">
                        {timezone}
                      </span>
                    )) : <span className="text-gray-600 dark:text-gray-300">No data available</span>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Calling Code</h3>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{callingCode}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">FIFA Code</h3>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{country.fifa || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Continent</h3>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{country.continents?.join(', ') || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Border Countries */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-900 dark:text-white">Neighboring Countries</h2>
            
            {borderCountries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {borderCountries.map(border => (
                  <Link 
                    key={border.cca3} 
                    to={`/country/${border.cca3}`}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200"
                  >
                    <div className="w-10 h-6 overflow-hidden rounded shadow mr-3">
                      <img 
                        src={border.flags.png} 
                        alt={`Flag of ${border.name.common}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{border.name.common}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">This country has no neighboring countries with land borders.</p>
            )}
          </div>
        </div>
        
        {/* Maps Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-900 dark:text-white">Maps</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {country.maps?.googleMaps && (
              <a 
                href={country.maps.googleMaps} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View on Google Maps</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Interactive map and directions</p>
                </div>
              </a>
            )}
            
            {country.maps?.openStreetMaps && (
              <a 
                href={country.maps.openStreetMaps} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View on OpenStreetMap</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Community built map data</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetailPage;