import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-card shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blockchain-primary to-blockchain-accent flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse-slow"></div>
                </div>
                <span className="text-lg font-bold gradient-text">SecureAudit</span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors">
                Home
              </Link>
              {user && (
                <>
                  <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/audit/new" className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-primary hover:text-primary transition-colors">
                    New Audit
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.full_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-4">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Sign in
                </Button>
                <Button onClick={() => navigate("/signup")}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
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
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 text-base font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/audit/new"
                  className="block pl-3 pr-4 py-2 text-base font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Audit
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            {user ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium">{user.full_name || 'User'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center pl-3 pr-4 py-2 text-base font-medium hover:bg-accent"
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center pl-3 pr-4 py-2 text-base font-medium hover:bg-accent"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  className="w-full"
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