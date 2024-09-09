import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faLightbulb,
  faChartLine,
  faSun,
  faMoon,
  faBars,
  faTimes,
  faClock,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import LogoutButton from "../user/LogoutButton";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle between light and dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Handle navigation to login
  const handleLogin = () => {
    navigate("/login");
  };

  // Toggle mobile menu open/close
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Handle the dark mode toggle
  const DarkModeToggle = () => (
    <label
      htmlFor="theme-toggle"
      className="relative inline-flex items-center cursor-pointer"
    >
      <input
        type="checkbox"
        id="theme-toggle"
        className="sr-only"
        checked={isDarkMode}
        onChange={() => setIsDarkMode(!isDarkMode)}
      />
      <div className="block bg-gray-200 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
      <div
        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-transform ${
          isDarkMode ? "translate-x-full" : ""
        }`}
      >
        <FontAwesomeIcon
          icon={isDarkMode ? faMoon : faSun}
          className={isDarkMode ? "text-gray-800" : "text-yellow-500"}
        />
      </div>
    </label>
  );

  // Render authenticated links for large screens
  const AuthenticatedLinks = () => (
    <div className="hidden md:flex space-x-6 items-center">
      <NavLink to="/" icon={faTasks} label="Tasks" />
      <NavLink
        to="/recommendations"
        icon={faLightbulb}
        label="Recommendations"
      />
      <NavLink to="/pomodoro" icon={faClock} label="Pomodoro" />
      <NavLink to="/dashboard" icon={faChartLine} label="Insights" />
    </div>
  );

  // Individual link component for consistency
  const NavLink = ({ to, icon, label }) => (
    <Link
      to={to}
      className="hover:text-light-nav dark:hover:text-dark-nav transition-colors flex items-center"
    >
      <FontAwesomeIcon icon={icon} className="mr-2" />
      {label}
    </Link>
  );

  // Render mobile menu links
  const MobileMenu = () => (
    <div className="md:hidden bg-light-navbg dark:bg-dark-navbg text-light-text dark:text-dark-text px-6 py-4 space-y-2">
      <NavLink to="/" icon={faTasks} label="Tasks" />
      <NavLink
        to="/recommendations"
        icon={faLightbulb}
        label="Recommendations"
      />
      <NavLink to="/pomodoro" icon={faClock} label="Pomodoro" />
      <NavLink to="/dashboard" icon={faChartLine} label="Insights" />
      {isAuthenticated ? (
        <LogoutButton onLogout={toggleMenu} />
      ) : (
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 text-light-text dark:text-dark-text p-2 rounded w-full text-center"
        >
          <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
          Login
        </button>
      )}
    </div>
  );

  return (
    <nav className="dark:bg-dark-navbg bg-light-navbg dark:text-dark-text text-light-text py-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold text-light-heading dark:text-dark-heading">
          <FontAwesomeIcon icon={faTasks} className="mr-2" />T A S K
        </h1>
        <div className="flex space-x-6 items-center">
          {isAuthenticated ? <AuthenticatedLinks /> : null}

          <DarkModeToggle />

          {isAuthenticated ? (
            <LogoutButton setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <button
              onClick={handleLogin}
              className="hover:text-light-nav dark:hover:text-dark-nav transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Login
            </button>
          )}

          <button
            className="md:hidden flex items-center text-light-nav dark:text-dark-nav focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {isMenuOpen && <MobileMenu />}
    </nav>
  );
};

export default Navbar;
