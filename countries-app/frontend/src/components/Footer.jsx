const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-6 px-4 mt-10">
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <p className="text-sm sm:text-base">&copy; 2025 <span className="font-semibold">Countries Explorer</span>. All rights reserved.</p>
        <p className="text-sm sm:text-base">
          Powered by{" "}
          <a
            href="https://restcountries.com/"
            className="text-blue-400 hover:text-blue-300 underline transition duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            REST Countries API
          </a>
        </p>
        <p className="text-xs text-gray-400">Built by <span className="text-white font-medium">Chamuditha Subharath</span></p>
      </div>
    </footer>
  );
};

export default Footer;
