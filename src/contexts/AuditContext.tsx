
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuditResult } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface AuditContextType {
  audits: AuditResult[];
  currentAudit: AuditResult | null;
  loading: boolean;
  performAudit: (name: string, code: string) => Promise<AuditResult>;
  getAudit: (id: string) => AuditResult | null;
  deleteAudit: (id: string) => Promise<void>;
  setCurrentAudit: (audit: AuditResult | null) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [currentAudit, setCurrentAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Load existing audits from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedAudits = localStorage.getItem(`audits-${user.id}`);
      if (storedAudits) {
        setAudits(JSON.parse(storedAudits));
      } else {
        setAudits([]);
      }
    } else {
      setAudits([]);
      setCurrentAudit(null);
    }
  }, [user]);

  // For demo purposes - in a real app this would use Gemini API
  const generateFakeAuditResult = (name: string, code: string): AuditResult => {
    const getRandomScore = (maxScore: number) => Math.floor(Math.random() * (maxScore * 0.4)) + Math.floor(maxScore * 0.6);
    
    const categories = [
      {
        name: "Security",
        score: getRandomScore(25),
        max_score: 25,
        description: "Assessment of security vulnerabilities and risks",
        issues: [
          {
            title: "Unchecked External Call",
            description: "The contract makes external calls without checking the return value.",
            severity: "medium" as const,
            code_reference: "line 45-50",
            recommendation: "Always check the return value of external calls and handle potential failures."
          },
          {
            title: "Input Validation",
            description: "Proper input validation is implemented for critical functions.",
            severity: "safe" as const,
            recommendation: "Continue maintaining proper input validation."
          }
        ]
      },
      {
        name: "Business Logic",
        score: getRandomScore(20),
        max_score: 20,
        description: "Evaluation of the contract's business logic implementation",
        issues: [
          {
            title: "Logic Implementation",
            description: "The core business logic is properly implemented with appropriate checks.",
            severity: "safe" as const,
            recommendation: "Continue with current implementation approach."
          }
        ]
      },
      {
        name: "Gas Optimization",
        score: getRandomScore(15),
        max_score: 15,
        description: "Analysis of gas usage and optimization opportunities",
        issues: [
          {
            title: "Redundant Storage",
            description: "Contract uses redundant storage operations that could be optimized.",
            severity: "low" as const,
            code_reference: "line 32",
            recommendation: "Consider caching values in memory instead of making multiple storage reads."
          }
        ]
      },
      {
        name: "Reentrancy Protection",
        score: getRandomScore(15),
        max_score: 15,
        description: "Assessment of reentrancy protection mechanisms",
        issues: [
          {
            title: "Missing Reentrancy Guard",
            description: "Some functions that interact with external contracts lack reentrancy protection.",
            severity: "high" as const,
            code_reference: "function withdraw()",
            recommendation: "Implement the ReentrancyGuard pattern from OpenZeppelin or use a mutex."
          }
        ]
      },
      {
        name: "Standards Compliance",
        score: getRandomScore(15),
        max_score: 15,
        description: "Adherence to Ethereum standards and best practices",
        issues: [
          {
            title: "ERC Standard Implementation",
            description: "The contract properly implements the relevant ERC standards.",
            severity: "safe" as const,
            recommendation: "Continue adhering to ERC standards for future development."
          }
        ]
      },
      {
        name: "Code Quality",
        score: getRandomScore(10),
        max_score: 10,
        description: "Review of code quality, readability, and documentation",
        issues: [
          {
            title: "Documentation",
            description: "The contract has adequate documentation for most functions.",
            severity: "info" as const,
            recommendation: "Consider adding more detailed documentation for complex functions."
          },
          {
            title: "Code Consistency",
            description: "Code style is consistent throughout the contract.",
            severity: "safe" as const,
            recommendation: "Continue maintaining consistent code style."
          }
        ]
      }
    ];
    
    // Calculate total score
    const totalScore = categories.reduce((sum, category) => sum + category.score, 0);
    const maxPossibleScore = categories.reduce((sum, category) => sum + category.max_score, 0);
    const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    return {
      id: "audit-" + Math.random().toString(36).substring(2, 9),
      user_id: user?.id || "anonymous",
      name,
      code,
      score: normalizedScore,
      created_at: new Date().toISOString(),
      categories,
      summary: "This smart contract has been analyzed for security vulnerabilities, gas optimization, and code quality. The overall score reflects the contract's security posture and adherence to best practices. Review the detailed findings for specific recommendations."
    };
  };

  const performAudit = async (name: string, code: string) => {
    try {
      setLoading(true);
      
      // In a real app, this would call the Gemini API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const auditResult = generateFakeAuditResult(name, code);
      
      // Add to state and save to localStorage
      const updatedAudits = [...audits, auditResult];
      setAudits(updatedAudits);
      setCurrentAudit(auditResult);
      
      if (user) {
        localStorage.setItem(`audits-${user.id}`, JSON.stringify(updatedAudits));
      }
      
      toast.success("Audit completed successfully!");
      return auditResult;
    } catch (error) {
      console.error("Error performing audit:", error);
      toast.error("Failed to complete audit. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAudit = (id: string) => {
    return audits.find(audit => audit.id === id) || null;
  };

  const deleteAudit = async (id: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAudits = audits.filter(audit => audit.id !== id);
      setAudits(updatedAudits);
      
      if (currentAudit?.id === id) {
        setCurrentAudit(null);
      }
      
      if (user) {
        localStorage.setItem(`audits-${user.id}`, JSON.stringify(updatedAudits));
      }
      
      toast.success("Audit deleted successfully");
    } catch (error) {
      console.error("Error deleting audit:", error);
      toast.error("Failed to delete audit. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuditContext.Provider
      value={{
        audits,
        currentAudit,
        loading,
        performAudit,
        getAudit,
        deleteAudit,
        setCurrentAudit,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error("useAudit must be used within an AuditProvider");
  }
  return context;
}
