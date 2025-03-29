import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, FileText, Code, AlertTriangle } from "lucide-react";
import Logo from "@/components/Logo";

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl opacity-70"></div>
        <div className="absolute top-40 -left-20 h-60 w-60 rounded-full bg-purple-100 dark:bg-purple-900/20 blur-3xl opacity-70"></div>
      </div>

      <div className="relative z-10 px-4 py-20 md:py-32 mx-auto container max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">AI-Powered Smart Contract Security</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Secure Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-600">Blockchain</span> Projects with AI Audits
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Automatically analyze Solidity code for vulnerabilities, gas optimizations, and best practices with our advanced AI audit system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white shadow-lg shadow-blue-500/20"
                onClick={() => navigate(user ? "/audit/new" : "/signup")}
              >
                {user ? "Start New Audit" : "Sign Up Free"}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => navigate(user ? "/dashboard" : "/login")}
              >
                {user ? "View Dashboard" : "Sign In"}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">In-depth Analysis</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Detailed Reports</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">PDF Exports</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md">
            <div className="relative mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-blue-400/10 animate-pulse-slow"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-violet-400/10 animate-pulse-slow"></div>
              
              {/* Card */}
              <div className="relative z-10 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-violet-600 text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Security Analysis</h3>
                    <div className="rounded-full bg-white/20 p-2">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-sm opacity-80 mt-1">Smart Contract Audit Score</p>
                  <div className="flex justify-between items-end mt-4">
                    <div className="text-5xl font-bold">87</div>
                    <div className="text-green-300 font-medium">Good</div>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-green-400 h-full" style={{ width: "87%" }}></div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Issues Found</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg border border-red-100 dark:border-red-800/30">
                      <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Missing Reentrancy Guard</h5>
                        <p className="text-xs text-red-700 dark:text-red-300">
                          Possible reentrancy vulnerability in withdraw() function
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Gas Optimization</h5>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          Using storage instead of memory for read-only values
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button variant="outline" size="sm" className="flex items-center text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>View Full Report</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}