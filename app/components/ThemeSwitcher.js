"use client"

/**
 * ThemeSwitcher provides a button for toggling between dark and light themes.
 * It visually changes depending on the current theme state to reflect the toggle action.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isDarkMode - Indicates if dark mode is currently enabled.
 * @param {Function} props.toggleDarkMode - Function to toggle the theme mode.
 * @returns {React.ReactElement} A button that toggles the theme mode when clicked.
 */

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