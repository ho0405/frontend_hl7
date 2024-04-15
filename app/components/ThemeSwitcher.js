"use client"


const ThemeSwitcher = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-yellow-400' : 'bg-gray-800'} ${isDarkMode ? 'text-gray-900' : 'text-white'} transition-colors duration-200`}
    >
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ThemeSwitcher;