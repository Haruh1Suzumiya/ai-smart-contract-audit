
import { ShieldCheck, Zap, FileText, Github, Code, AlertTriangle } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="p-6 border border-border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Security Analysis",
      description: "Detect vulnerabilities like reentrancy, overflow/underflow, and other common security issues in your smart contracts."
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "Gas Optimization",
      description: "Identify gas-inefficient code patterns and receive recommendations to reduce transaction costs."
    },
    {
      icon: <Code className="h-6 w-6 text-white" />,
      title: "Code Quality",
      description: "Evaluate code structure, best practices, and readability to ensure maintainable and reliable contract code."
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-white" />,
      title: "Severity Ranking",
      description: "Prioritize issues based on risk levels, helping you focus on critical vulnerabilities first."
    },
    {
      icon: <Github className="h-6 w-6 text-white" />,
      title: "GitHub Integration",
      description: "Connect directly to your GitHub repositories to audit contracts without manual copying and pasting."
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: "Detailed Reports",
      description: "Generate comprehensive audit reports with PDF export capabilities for sharing with stakeholders."
    }
  ];

  return (
    <div className="py-16 bg-muted">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Audit Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform offers a complete suite of smart contract analysis tools to ensure your code is secure and optimized.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
