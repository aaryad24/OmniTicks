import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon, SearchIcon, TicketPlus } from "lucide-react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const { favoriteMovies } = useAppContext();

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex    justify-between items-center bg-[#01122D] backdrop-blur-lg border-b border-cyan-500/20">
      {/* Logo with Neon Glow */}
      <Link 
        to="/" 
        className="flex items-start h-full group bg-amber-800"
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-cyan-500 rounded-lg blur opacity-0   transition-all duration-300"></div>
          <img
            src="qwe.png"
            alt="logo"
            className="relative h-[65px] w-auto object-contain z-10"
          />
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1 bg-gray-800/50 backdrop-blur-md rounded-full px-4 py-1 border border-cyan-500/20">
        <NavLink to="/" setIsOpen={setIsOpen}>Home</NavLink>
        <NavLink to="/movies" setIsOpen={setIsOpen}>Movies</NavLink>
        <NavLink to="/theaters" setIsOpen={setIsOpen}>Theaters</NavLink>
        <NavLink to="/releases" setIsOpen={setIsOpen}>Releases</NavLink>
        {favoriteMovies.length > 0 && (
          <NavLink to="/favorite" setIsOpen={setIsOpen}>Favorites</NavLink>
        )}
      </div>

      {/* User Actions */}
      <div className="flex left-7 px-6 gap-6">
        {/* Search Icon */}
        <button className="p-2 rounded-full hover:bg-gray-800/50 transition-all">
          <SearchIcon className="w-5 h-5 text-cyan-400" />
        </button>

        {!user ? (
          <button
            onClick={openSignIn}
            className="relative overflow-hidden px-5 py-2 rounded-full font-medium cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-100 group-hover:opacity-90 transition-all"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-all"></div>
            <div className="absolute inset-[2px] bg-gray-900 rounded-full"></div>
            <span className="relative z-10 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent group-hover:text-white transition-all">
              Login
            </span>
          </button>
        ) : (
          <UserButton >
              <div className="absolute -inset-1 bg-cyan-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
              <UserButton.MenuItems className="bg-gray-800 border border-cyan-500/20 rounded-lg overflow-hidden">
                <UserButton.Action
                  label="Bookings"
                  labelIcon={<TicketPlus width={15} className="text-cyan-400" />}
                  onClick={() => navigate("/my-bookings")}
                  className="hover:bg-gray-700/50 transition-colors"
                />
              </UserButton.MenuItems>
            </UserButton>
        )}

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-full hover:bg-gray-800/50"
        >
          {isOpen ? (
            <XIcon className="w-6 h-6 text-cyan-400" />
          ) : (
            <MenuIcon className="w-6 h-6 text-cyan-400" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-gray-900/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <XIcon
          className="absolute top-6 right-6 w-8 h-8 text-cyan-400 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
        <MobileNavLink to="/" setIsOpen={setIsOpen}>Home</MobileNavLink>
        <MobileNavLink to="/movies" setIsOpen={setIsOpen}>Movies</MobileNavLink>
        <MobileNavLink to="/theaters" setIsOpen={setIsOpen}>Theaters</MobileNavLink>
        <MobileNavLink to="/releases" setIsOpen={setIsOpen}>Releases</MobileNavLink>
        {favoriteMovies.length > 0 && (
          <MobileNavLink to="/favorite" setIsOpen={setIsOpen}>Favorites</MobileNavLink>
        )}
      </div>
    </div>
  );
};

// Reusable NavLink Component
const NavLink = ({ to, children, setIsOpen }) => (
  <Link
    to={to}
    onClick={() => {
      window.scrollTo(0, 0);
      setIsOpen(false);
    }}
    className="relative px-4 py-2 group"
  >
    <span className="relative z-10 text-gray-300 group-hover:text-white transition-colors">
      {children}
    </span>
    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-cyan-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
  </Link>
);

// Mobile NavLink Variant
const MobileNavLink = ({ to, children, setIsOpen }) => (
  <Link
    to={to}
    onClick={() => {
      window.scrollTo(0, 0);
      setIsOpen(false);
    }}
    className="text-2xl font-medium text-gray-300 hover:text-cyan-400 transition-colors px-6 py-2 relative"
  >
    {children}
    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-cyan-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
  </Link>
);

export default Navbar;