import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { path: '/buy', label: 'Buy a House' },
    { path: '/sell', label: 'Sell a House' },
    { path: '/manage', label: 'Manage Property' },
    { path: '/rent', label: 'Rent Property' },
    { path: '/services', label: 'Services' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    switch (user.user_type) {
      case 'seller':
        return '/dashboard/seller';
      case 'agent':
        return '/dashboard/seller'; // Agents go to seller dashboard for now
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/dashboard';
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.first_name || user.username;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#577A26] backdrop-blur supports-[backdrop-filter]:bg-[#577A26] shadow-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo with PNG */}
        <Link 
          to="/" 
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img 
            src="/logorealestate.png"  
            alt="PristinePrimier Real Estate" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-base ${
                isActive(link.path)
                  ? 'text-black border-b-2 border-black font-semibold'
                  : 'text-black/80 hover:text-black hover:border-b-2 hover:border-black/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-black/80">
                Welcome, {getUserDisplayName()}
              </span>
              <Button asChild variant="outline" size="sm" className="border-black text-black hover:bg-black hover:text-white">
                <Link to={getDashboardPath()}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-black/80 hover:text-black hover:bg-black/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-black/80 hover:text-black hover:bg-black/10">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-black text-black hover:bg-black hover:text-white">
                <Link to="/auth">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/20 bg-[#577A26] animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium py-2 transition-base ${
                  isActive(link.path) ? 'text-black font-semibold border-l-2 border-black pl-2' : 'text-black/80 hover:text-black'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t border-black/20">
              {user ? (
                <>
                  <div className="text-sm text-black/80 text-center py-2">
                    Welcome, {getUserDisplayName()}
                  </div>
                  <Button asChild variant="outline" size="sm" className="border-black text-black hover:bg-black hover:text-white">
                    <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-black/80 hover:text-black hover:bg-black/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-black/80 hover:text-black hover:bg-black/10">
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="border-black text-black hover:bg-black hover:text-white">
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;