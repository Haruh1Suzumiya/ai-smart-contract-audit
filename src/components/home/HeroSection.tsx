
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertTriangle, FileText } from "lucide-react";

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="px-4 py-20 md:py-32 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">AI-Powered Smart Contract Security</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Secure Your <span className="gradient-text">Blockchain</span> Projects with AI Audits
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Automatically analyze Solidity code for vulnerabilities, gas optimizations, and best practices with our advanced AI audit system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="gradient-bg"
              onClick={() => navigate(user ? "/audit/new" : "/signup")}
            >
              {user ? "Start New Audit" : "Sign Up Free"}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/login")}
            >
              {user ? "View Dashboard" : "Sign In"}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">In-depth Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Detailed Reports</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">PDF Exports</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/10 rounded-full animate-pulse-slow"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/10 rounded-full animate-pulse-slow"></div>
            
            <div className="relative z-10 bg-card rounded-xl shadow-xl border border-border overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blockchain-primary to-blockchain-secondary text-white">
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
                <h4 className="font-medium mb-4">Issues Found</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-sm">Missing Reentrancy Guard</h5>
                      <p className="text-xs text-gray-700">
                        Possible reentrancy vulnerability in withdraw() function
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-sm">Gas Optimization</h5>
                      <p className="text-xs text-gray-700">
                        Using storage instead of memory for read-only values
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button variant="outline" size="sm" className="flex items-center">
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
  );
}
