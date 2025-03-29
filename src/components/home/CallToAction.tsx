import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import Logo from "@/components/Logo";

export default function CallToAction() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 -z-10"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-300/10 dark:bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-violet-300/10 dark:bg-violet-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container px-4 mx-auto max-w-5xl relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 border border-gray-200 dark:border-gray-700">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-600 p-3 mb-6 shadow-lg shadow-blue-500/20">
              <Shield className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-700 dark:from-blue-400 dark:to-violet-500">
              Secure Your Smart Contracts Today
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Don't let vulnerabilities compromise your blockchain projects. Start using our AI-powered audit tool and ensure your smart contracts are secure and optimized.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white shadow-lg shadow-blue-500/20"
                onClick={() => navigate(user ? "/audit/new" : "/signup")}
              >
                {user ? "Start New Audit" : "Create Free Account"}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => navigate(user ? "/dashboard" : "/login")}
              >
                {user ? "View Dashboard" : "Learn More"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}