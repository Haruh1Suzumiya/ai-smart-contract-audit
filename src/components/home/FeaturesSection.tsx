import { ShieldCheck, Zap, FileText, Github, Code, AlertTriangle } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
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
    <div className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Comprehensive Audit Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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