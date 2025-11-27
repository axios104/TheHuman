import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const handleLogoClick = () => {
    navigate(isAuthenticated() ? '/dashboard' : '/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-background-dark/80 px-4 py-3 backdrop-blur-sm sm:px-10">
      <div 
        className="flex items-center gap-4 text-white cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={handleLogoClick}
      >
        <div className="size-4 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path 
              clipRule="evenodd" 
              d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" 
              fill="currentColor" 
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-white">HUMAN</h2>
      </div>
      
      <div className="hidden flex-1 justify-center gap-8 sm:flex">
        <button 
          onClick={() => navigate('/')}
          className={`text-sm font-medium leading-normal transition-colors ${
            isActive('/') ? 'text-primary' : 'text-white/80 hover:text-white'
          }`}
        >
          Platform
        </button>
        <button 
          onClick={() => navigate('/stories')}
          className={`text-sm font-medium leading-normal transition-colors ${
            isActive('/stories') ? 'text-primary' : 'text-white/80 hover:text-white'
          }`}
        >
          Stories
        </button>
        <button 
          onClick={() => navigate('/philosophy')}
          className={`text-sm font-medium leading-normal transition-colors ${
            isActive('/philosophy') ? 'text-primary' : 'text-white/80 hover:text-white'
          }`}
        >
          About
        </button>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated() ? (
          <>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] transition-all hover:shadow-[0_0_20px_0px_#0df2f2]"
            >
              <span className="truncate">Profile</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] transition-all hover:shadow-[0_0_20px_0px_#0df2f2]"
            >
              <span className="truncate">Get Started</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
