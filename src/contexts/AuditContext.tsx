import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuditResult } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { saveAuditResult, getAuditResults, getAuditResultById } from "@/lib/supabase";
import { performAudit, fetchCodeFromGithub } from "@/lib/gemini";

interface AuditContextType {
  audits: AuditResult[];
  currentAudit: AuditResult | null;
  loading: boolean;
  performAudit: (name: string, code: string, sourceType: 'manual' | 'file' | 'github') => Promise<AuditResult>;
  getAudit: (id: string) => Promise<AuditResult | null>;
  deleteAudit: (id: string) => Promise<void>;
  setCurrentAudit: (audit: AuditResult | null) => void;
  fetchCodeFromGitHub: (url: string) => Promise<string>;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [currentAudit, setCurrentAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 監査履歴を読み込む
  useEffect(() => {
    const loadAudits = async () => {
      if (!user) {
        setAudits([]);
        return;
      }

      try {
        setLoading(true);
        const auditResults = await getAuditResults(user.id);
        setAudits(auditResults);
      } catch (error) {
        console.error("Error loading audit results:", error);
        toast.error("Failed to load audit history");
      } finally {
        setLoading(false);
      }
    };

    loadAudits();
  }, [user]);

  // GitHubからコードを取得
  const fetchCodeFromGitHub = async (url: string) => {
    try {
      return await fetchCodeFromGithub(url);
    } catch (error) {
      console.error("Error fetching code from GitHub:", error);
      toast.error("Failed to fetch code from GitHub");
      throw error;
    }
  };

  // 監査実行関数
  const executeAudit = async (name: string, code: string, sourceType: 'manual' | 'file' | 'github') => {
    if (!user) {
      throw new Error("You must be logged in to perform an audit");
    }

    try {
      setLoading(true);
      
      // Gemini APIで監査を実行
      const auditResult = await performAudit(user.id, code);
      
      // 監査結果をDBに保存
      const savedResult = await saveAuditResult(
        user.id,
        name,
        code,
        sourceType,
        auditResult.score,
        auditResult,
        auditResult.summary
      );
      
      // AuditResultオブジェクトに変換
      const processedResult: AuditResult = {
        id: savedResult.id,
        user_id: savedResult.user_id,
        name: savedResult.name,
        code: savedResult.code,
        score: savedResult.score,
        categories: auditResult.categories,
        summary: savedResult.summary,
        created_at: savedResult.created_at
      };
      
      // 最新の監査結果をリストに追加
      setAudits(prev => [processedResult, ...prev]);
      setCurrentAudit(processedResult);
      
      toast.success("Audit completed successfully!");
      return processedResult;
    } catch (error) {
      console.error("Error performing audit:", error);
      toast.error("Failed to complete audit");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 監査結果を取得
  const getAudit = async (id: string) => {
    if (!user) return null;
    
    try {
      const result = await getAuditResultById(user.id, id);
      
      // AuditResultオブジェクトに変換
      const processedResult: AuditResult = {
        id: result.id,
        user_id: result.user_id,
        name: result.name,
        code: result.code,
        score: result.score,
        categories: result.result.categories,
        summary: result.summary,
        created_at: result.created_at
      };
      
      return processedResult;
    } catch (error) {
      console.error("Error getting audit:", error);
      return null;
    }
  };

  // 監査結果を削除（現在は未実装）
  const deleteAudit = async (id: string) => {
    // 将来的に実装
    toast.error("Delete functionality is not implemented yet");
  };

  return (
    <AuditContext.Provider
      value={{
        audits,
        currentAudit,
        loading,
        performAudit: executeAudit,
        getAudit,
        deleteAudit,
        setCurrentAudit,
        fetchCodeFromGitHub
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