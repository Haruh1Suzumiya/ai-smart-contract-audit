import { Shield } from "lucide-react";

export default function AuditLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="relative animate-bounce">
        <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-audit-high rounded-full animate-ping"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-audit-safe rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
      </div>
      
      <h3 className="text-2xl font-bold mt-6 mb-2">Analyzing Smart Contract</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Our AI is thoroughly examining your code for security vulnerabilities, 
        gas optimizations, and best practices. This may take a few moments...
      </p>
      
      <div className="mt-8 w-64 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-pulse-slow"></div>
      </div>
      
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <div className="h-5 w-5 rounded-full bg-audit-high animate-pulse"></div>
          </div>
          <p className="text-sm">Checking Vulnerabilities</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <div className="h-5 w-5 rounded-full bg-audit-info animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <p className="text-sm">Optimizing Gas Usage</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
          <div className="h-5 w-5 rounded-full bg-audit-medium animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-sm">Reviewing Code Quality</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <div className="h-5 w-5 rounded-full bg-audit-safe animate-pulse" style={{ animationDelay: "0.6s" }}></div>
          </div>
          <p className="text-sm">Checking Best Practices</p>
        </div>
      </div>
    </div>
  );
}