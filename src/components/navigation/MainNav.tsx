import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MainNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if we're in a dashboard-related page
  const isDashboardPage = location.pathname.includes('/dashboard') || 
    location.pathname.includes('/audit/') || 
    location.pathname.includes('/settings') ||
    location.pathname.includes('/reports') ||
    location.pathname.includes('/features/');

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center h-full">
          {/* Only show logo in navbar on landing pages, not dashboard */}
          {!isDashboardPage && (
            <Link to="/" className="flex items-center space-x-2">
              <Logo size={36} />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-600">
                SecureAudit
              </span>
            </Link>
          )}
          
          <div className="hidden md:ml-8 md:flex md:space-x-8 h-full">
            <Link 
              to="/" 
              className={`inline-flex items-center px-1 h-full border-b-2 ${
                location.pathname === '/' 
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400'
              } transition-colors text-sm font-medium`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`inline-flex items-center px-1 h-full border-b-2 ${
                    location.pathname === '/dashboard' 
                      ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                      : 'border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400'
                  } transition-colors text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/audit/new" 
                  className={`inline-flex items-center px-1 h-full border-b-2 ${
                    location.pathname === '/audit/new' 
                      ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                      : 'border-transparent hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400'
                  } transition-colors text-sm font-medium`}
                >
                  New Audit
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="group flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hidden md:block">
                    {user.full_name || 'Account'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Sign in
              </Button>
              <Button 
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white"
              >
                Sign up
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden ml-4">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 focus:outline-none transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 z-40 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/audit/new"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Audit
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
            {user ? (
              <>
                <div className="flex items-center px-4 py-2">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user.full_name || 'User'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-4 flex flex-col">
                <Button
                  variant="outline"
                  className="justify-center mb-2"
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  className="justify-center bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white"
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}