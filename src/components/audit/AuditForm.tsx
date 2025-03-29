import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAudit } from "@/contexts/AuditContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SAMPLE_SOLIDITY_CODE } from "@/lib/constants";
import { toast } from "sonner";
import { 
  FileText, 
  Github, 
  Upload, 
  Code, 
  AlertTriangle, 
  Loader2 
} from "lucide-react";
import { getApiKey } from "@/lib/supabase";

export default function AuditForm() {
  const { performAudit, loading, fetchCodeFromGitHub } = useAudit();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [code, setCode] = useState(SAMPLE_SOLIDITY_CODE);
  const [githubRepo, setGithubRepo] = useState("");
  const [activeTab, setActiveTab] = useState<string>("code");
  const [fetchingGithub, setFetchingGithub] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  // APIキーのチェック
  useEffect(() => {
    const checkApiKey = async () => {
      if (!user) return false;
      
      try {
        const apiKey = await getApiKey(user.id, 'gemini');
        const missing = !apiKey;
        setApiKeyMissing(missing);
        return !missing;
      } catch (error) {
        console.error("Error checking API key:", error);
        setApiKeyMissing(true);
        return false;
      }
    };
    
    checkApiKey();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter a name for this audit");
      return;
    }
    
    if (!code && activeTab === "code") {
      toast.error("Please enter or paste some Solidity code");
      return;
    }
    
    if (!githubRepo && activeTab === "github") {
      toast.error("Please enter a GitHub repository URL");
      return;
    }
    
    // APIキーの確認
    if (apiKeyMissing) {
      toast.error("Gemini API key is missing. Please add it in the settings.");
      navigate("/settings");
      return;
    }
    
    try {
      const sourceCode = code;
      let sourceType: 'manual' | 'file' | 'github' = 'manual';
      
      if (activeTab === "github") {
        sourceType = 'github';
      } else if (activeTab === "file") {
        sourceType = 'file';
      }
      
      const auditResult = await performAudit(name, sourceCode, sourceType);
      navigate(`/audit/result/${auditResult.id}`);
    } catch (error) {
      console.error("Audit submission error:", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      setActiveTab("code");
      toast.success(`File "${file.name}" loaded successfully`);
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsText(file);
  };

  const handleGithubImport = async () => {
    if (!githubRepo) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }
    
    if (!githubRepo.includes("github.com")) {
      toast.error("Please enter a valid GitHub repository URL");
      return;
    }
    
    try {
      setFetchingGithub(true);
      const sourceCode = await fetchCodeFromGitHub(githubRepo);
      setCode(sourceCode);
      setActiveTab("code");
      toast.success("GitHub repository code imported successfully");
    } catch (error) {
      console.error("GitHub import error:", error);
      toast.error("Failed to import code from GitHub");
    } finally {
      setFetchingGithub(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">New Smart Contract Audit</h2>
        <p className="text-muted-foreground">Submit your Solidity code for analysis</p>
      </div>
      
      {apiKeyMissing && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Gemini API key is missing. Please add it in the{" "}
            <a 
              href="/settings"
              className="font-medium underline underline-offset-4"
            >
              Settings
            </a>{" "}
            to perform audits.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Audit Name</Label>
          <Input
            id="name"
            placeholder="My Smart Contract Audit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Code</span>
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>File Upload</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center space-x-2">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="solidity-code">Solidity Code</Label>
              <Textarea
                id="solidity-code"
                placeholder="Paste your Solidity code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono h-80 code-block"
                required
              />
            </div>
          </TabsContent>
          
          <TabsContent value="file" className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Upload Solidity File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your .sol file here, or click to browse
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".sol"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Browse Files
                </Button>
              </div>
              
              {code && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="code-block h-40 overflow-auto">
                    <pre>{code.substring(0, 500)}{code.length > 500 ? '...' : ''}</pre>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="github" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-repo">GitHub Repository URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="github-repo"
                  placeholder="https://github.com/username/repo"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGithubImport}
                  disabled={fetchingGithub}
                >
                  {fetchingGithub ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    "Import"
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the URL of the public repository containing your Solidity code
              </p>
            </div>
            
            {code && activeTab === "github" && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="code-block h-40 overflow-auto">
                  <pre>{code.substring(0, 500)}{code.length > 500 ? '...' : ''}</pre>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Analyzing Contract...</span>
            </>
          ) : (
            "Start Audit"
          )}
        </Button>
      </form>
    </div>
  );
}