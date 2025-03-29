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
  Loader2,
  CloudUpload,
  Terminal,
  FileCode,
  Shield
} from "lucide-react";
import { getApiKey } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [fileName, setFileName] = useState<string | null>(null);
  
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
    
    setFileName(file.name);
    
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
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">New Smart Contract Audit</CardTitle>
        <CardDescription>Submit your Solidity code for AI-powered security analysis</CardDescription>
      </CardHeader>
      
      <CardContent>
        {apiKeyMissing && (
          <Alert variant="destructive" className="mb-6">
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
              className="border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger 
                value="code" 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
              >
                <Code className="h-4 w-4" />
                <span>Code</span>
              </TabsTrigger>
              <TabsTrigger 
                value="file" 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
              >
                <FileText className="h-4 w-4" />
                <span>File Upload</span>
              </TabsTrigger>
              <TabsTrigger 
                value="github" 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="solidity-code">Solidity Code</Label>
                <Textarea
                  id="solidity-code"
                  placeholder="Paste your Solidity code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono h-80 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                  required
                />
              </div>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center bg-gray-50 dark:bg-gray-900/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  <CloudUpload className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upload Solidity File</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                    className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                  
                  {fileName && (
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FileCode className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{fileName}</span>
                    </div>
                  )}
                </div>
                
                {code && activeTab === "file" && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-700 h-40 overflow-auto font-mono text-sm">
                      <pre>{code.substring(0, 500)}{code.length > 500 ? '...' : ''}</pre>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="github" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="github-repo">GitHub Repository URL</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Github className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="github-repo"
                      placeholder="https://github.com/username/repo"
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      className="pl-10 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGithubImport}
                    disabled={fetchingGithub}
                    className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {fetchingGithub ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Importing...</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="h-4 w-4 mr-2" />
                        <span>Import</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the URL of the public repository containing your Solidity code
                </p>
              </div>
              
              {code && activeTab === "github" && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-300 dark:border-gray-700 h-40 overflow-auto font-mono text-sm">
                    <pre>{code.substring(0, 500)}{code.length > 500 ? '...' : ''}</pre>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white" 
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Analyzing Contract...</span>
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              <span>Start Audit</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}