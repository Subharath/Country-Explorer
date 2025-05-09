const CountryDetail = ({ country }) => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <img src={country.flags.png} alt={country.name.common} className="w-full h-60 object-cover rounded" />
        <h2 className="text-3xl font-bold mt-4">{country.name.common}</h2>
        <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Languages:</strong> {Object.values(country.languages || {}).join(', ')}</p>
      </div>
    );
  };
  
  export default CountryDetail;