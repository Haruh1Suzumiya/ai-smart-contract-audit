
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ApiKey } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface ApiKeyContextType {
  apiKeys: ApiKey[];
  loading: boolean;
  createApiKey: (name: string) => Promise<ApiKey>;
  deleteApiKey: (id: string) => Promise<void>;
  getGeminiApiKey: () => string | null;
  setGeminiApiKey: (key: string) => Promise<void>;
  getElevenLabsApiKey: () => string | null;
  setElevenLabsApiKey: (key: string) => Promise<void>;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);

  // Load existing API keys from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedApiKeys = localStorage.getItem(`apiKeys-${user.id}`);
      if (storedApiKeys) {
        setApiKeys(JSON.parse(storedApiKeys));
      } else {
        setApiKeys([]);
      }
    } else {
      setApiKeys([]);
    }
  }, [user]);

  const createApiKey = async (name: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newApiKey: ApiKey = {
        id: "key-" + Math.random().toString(36).substring(2, 9),
        user_id: user?.id || "anonymous",
        name,
        key: "sk-" + Math.random().toString(36).substring(2, 30),
      };
      
      const updatedApiKeys = [...apiKeys, newApiKey];
      setApiKeys(updatedApiKeys);
      
      if (user) {
        localStorage.setItem(`apiKeys-${user.id}`, JSON.stringify(updatedApiKeys));
      }
      
      toast.success("API key created successfully");
      return newApiKey;
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error("Failed to create API key. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedApiKeys = apiKeys.filter(key => key.id !== id);
      setApiKeys(updatedApiKeys);
      
      if (user) {
        localStorage.setItem(`apiKeys-${user.id}`, JSON.stringify(updatedApiKeys));
      }
      
      toast.success("API key deleted successfully");
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getGeminiApiKey = () => {
    if (!user) return null;
    return localStorage.getItem(`gemini-api-key-${user.id}`);
  };

  const setGeminiApiKey = async (key: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user) {
        localStorage.setItem(`gemini-api-key-${user.id}`, key);
      }
      
      toast.success("Gemini API key saved successfully");
    } catch (error) {
      console.error("Error saving Gemini API key:", error);
      toast.error("Failed to save Gemini API key. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getElevenLabsApiKey = () => {
    if (!user) return null;
    return localStorage.getItem(`elevenlabs-api-key-${user.id}`);
  };

  const setElevenLabsApiKey = async (key: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user) {
        localStorage.setItem(`elevenlabs-api-key-${user.id}`, key);
      }
      
      toast.success("ElevenLabs API key saved successfully");
    } catch (error) {
      console.error("Error saving ElevenLabs API key:", error);
      toast.error("Failed to save ElevenLabs API key. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApiKeyContext.Provider
      value={{
        apiKeys,
        loading,
        createApiKey,
        deleteApiKey,
        getGeminiApiKey,
        setGeminiApiKey,
        getElevenLabsApiKey,
        setElevenLabsApiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
}
