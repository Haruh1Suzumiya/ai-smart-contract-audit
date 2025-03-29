import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Session, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Get session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          await handleSession(session);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await handleSession(session);
        } else {
          setUser(null);
        }
      }
    );

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to get user data from session
  const handleSession = async (session: Session) => {
    const currentUser = session.user;
    
    // Format user data to match our User type
    const userData: User = {
      id: currentUser.id,
      email: currentUser.email || "",
      full_name: currentUser.user_metadata.full_name || "",
      created_at: currentUser.created_at,
    };
    
    setUser(userData);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in:", error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Account created successfully! Please check your email to verify your account.");
    } catch (error) {
      console.error("Error signing up:", error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sign out. Please try again.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}