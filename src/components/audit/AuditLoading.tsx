import { Shield } from "lucide-react";
import Logo from "@/components/Logo";

export default function AuditLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="relative mb-8">
        <div className="relative animate-bounce">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-500 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Analyzing Smart Contract</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        Our AI is thoroughly examining your code for security vulnerabilities, 
        gas optimizations, and best practices. This may take a few moments...
      </p>
      
      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-10">
        <div className="h-full bg-gradient-to-r from-blue-500 to-violet-600 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
            <div className="h-6 w-6 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Checking Vulnerabilities</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
            <div className="h-6 w-6 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Optimizing Gas Usage</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-2">
            <div className="h-6 w-6 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Reviewing Code Quality</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
            <div className="h-6 w-6 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "0.6s" }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Checking Best Practices</p>
        </div>
      </div>
    </div>
  );
}