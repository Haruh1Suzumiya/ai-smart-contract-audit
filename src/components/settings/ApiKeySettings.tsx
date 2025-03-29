import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Copy, 
  Eye, 
  EyeOff, 
  Save, 
  Key, 
  Trash2, 
  RefreshCw,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import { getApiKey, saveApiKey } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ApiKeySettings() {
  const { user } = useAuth();
  
  const [geminiKey, setGeminiKey] = useState("");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [keyTypeToReset, setKeyTypeToReset] = useState<"gemini" | null>(null);
  const [status, setStatus] = useState<"empty" | "saved" | "edited">("empty");
  const [successMessage, setSuccessMessage] = useState("");

  // APIキーの取得
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const geminiApiKey = await getApiKey(user.id, 'gemini');
        if (geminiApiKey) {
          setGeminiKey(geminiApiKey);
          setStatus("saved");
        } else {
          setStatus("empty");
        }
      } catch (error) {
        console.error("Error fetching API keys:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApiKeys();
  }, [user]);

  const handleGeminiKeyChange = (value: string) => {
    setGeminiKey(value);
    if (value) {
      setStatus("edited");
    } else {
      setStatus("empty");
    }
    setSuccessMessage("");
  };

  const handleSaveGeminiKey = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      await saveApiKey(user.id, 'gemini', geminiKey);
      
      setStatus("saved");
      setSuccessMessage("Gemini API key saved successfully");
      toast.success("Gemini API key saved successfully");
    } catch (error) {
      console.error("Save Gemini API key error:", error);
      toast.error("Failed to save Gemini API key");
    } finally {
      setLoading(false);
    }
  };

  const resetKey = (type: "gemini") => {
    setKeyTypeToReset(type);
    setResetConfirmOpen(true);
  };

  const confirmReset = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      if (keyTypeToReset === "gemini") {
        await saveApiKey(user.id, 'gemini', "");
        setGeminiKey("");
        setStatus("empty");
        setSuccessMessage("Gemini API key removed successfully");
        toast.success("Gemini API key removed");
      }
    } catch (error) {
      console.error("Reset API key error:", error);
      toast.error("Failed to reset API key");
    } finally {
      setResetConfirmOpen(false);
      setKeyTypeToReset(null);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300">
          <AlertDescription className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Gemini API Key
          </CardTitle>
          <CardDescription>
            Configure your Google Gemini API key for smart contract security analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gemini-api-key" className="text-gray-700 dark:text-gray-300">API Key</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="gemini-api-key"
                  type={showGeminiKey ? "text" : "password"}
                  value={geminiKey}
                  onChange={(e) => handleGeminiKeyChange(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="pr-10 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-gray-400 hover:text-gray-500"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                >
                  {showGeminiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {geminiKey && status === "saved" && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => copyToClipboard(geminiKey, "Gemini API key")}
                  className="px-3 border-gray-300 dark:border-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={handleSaveGeminiKey}
                disabled={loading || status === "saved" || !geminiKey}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
              <Key className="h-4 w-4 mr-1" />
              How to get a Gemini API key
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
              You can obtain a Gemini API key from the Google AI Studio. Follow these steps:
            </p>
            <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 ml-5 list-decimal">
              <li>Go to Google AI Studio website</li>
              <li>Sign in with your Google account</li>
              <li>Navigate to the API Keys section</li>
              <li>Create a new API key</li>
              <li>Copy and paste the API key here</li>
            </ol>
            <div className="mt-3 flex justify-end">
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Visit Google AI Studio
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
          
          {geminiKey && status === "saved" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetKey("gemini")}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-900/20 flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Reset API Key
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your saved API key. You'll need to re-enter it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmReset}
              className="bg-red-600 hover:bg-red-700 focus:bg-red-700"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}