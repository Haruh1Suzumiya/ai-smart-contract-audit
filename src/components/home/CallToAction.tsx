
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function CallToAction() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="py-16">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center rounded-full gradient-bg p-3 mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Secure Your Smart Contracts Today
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't let vulnerabilities compromise your blockchain projects. Start using our AI-powered audit tool and ensure your smart contracts are secure and optimized.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="gradient-bg"
              onClick={() => navigate(user ? "/audit/new" : "/signup")}
            >
              {user ? "Start New Audit" : "Create Free Account"}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/login")}
            >
              {user ? "View Dashboard" : "Learn More"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
