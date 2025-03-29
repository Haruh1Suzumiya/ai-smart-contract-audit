import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Copy, Eye, EyeOff, Save } from "lucide-react";
import { getApiKey, saveApiKey } from "@/lib/supabase";

export default function ApiKeySettings() {
  const { user } = useAuth();
  
  const [geminiKey, setGeminiKey] = useState("");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [keyTypeToReset, setKeyTypeToReset] = useState<"gemini" | null>(null);

  // APIキーの取得
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const geminiApiKey = await getApiKey(user.id, 'gemini');
        if (geminiApiKey) {
          setGeminiKey(geminiApiKey);
        }
      } catch (error) {
        console.error("Error fetching API keys:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApiKeys();
  }, [user]);

  const handleSaveGeminiKey = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      await saveApiKey(user.id, 'gemini', geminiKey);
      
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
      <Card>
        <CardHeader>
          <CardTitle>Gemini API Key</CardTitle>
          <CardDescription>
            Manage your Gemini API key for smart contract analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-api-key">API Key</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="gemini-api-key"
                  type={showGeminiKey ? "text" : "password"}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                >
                  {showGeminiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {geminiKey && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => copyToClipboard(geminiKey, "Gemini API key")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={handleSaveGeminiKey}
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                <span>Save</span>
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              You can obtain a Gemini API key from the{" "}
              
                href="https://ai.google.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
          {geminiKey && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetKey("gemini")}
            >
              Reset API Key
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your saved API key. You&apos;ll need to re-enter it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}