import { useNavigate } from "react-router-dom";
import { useAudit } from "@/contexts/AuditContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getScoreColor, getScoreLabel } from "@/lib/constants";
import { 
  BarChart3, 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Shield, 
  Zap,
  Code
} from "lucide-react";

export default function DashboardOverview() {
  const { audits } = useAudit();
  const navigate = useNavigate();
  
  // Calculate stats
  const totalAudits = audits.length;
  const recentAudits = audits.slice().sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 3);
  
  const avgScore = totalAudits > 0
    ? Math.round(audits.reduce((sum, audit) => sum + audit.score, 0) / totalAudits)
    : 0;
  
  const criticalVulnerabilities = audits.reduce((count, audit) => {
    if (!audit.categories) return count;
    
    const criticalIssues = audit.categories.flatMap(cat => {
      if (!cat.issues) return [];
      return cat.issues.filter(issue => issue.severity === "high");
    });
    
    return count + criticalIssues.length;
  }, 0);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to your smart contract audit dashboard</p>
        </div>
        <Button 
          onClick={() => navigate("/audit/new")}
          className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Audit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
                <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalAudits}</div>
                <p className="text-xs text-muted-foreground">Smart contracts analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-green-100 dark:bg-green-900/30">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>
                  {avgScore}/100
                </div>
                <p className="text-xs text-muted-foreground">{getScoreLabel(avgScore)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {criticalVulnerabilities}
                </div>
                <p className="text-xs text-muted-foreground">High severity issues found</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-4 rounded-full p-2 bg-purple-100 dark:bg-purple-900/30">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-bold truncate max-w-[140px]">
                  {recentAudits.length > 0 
                    ? new Date(recentAudits[0].created_at).toLocaleDateString() 
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Last security analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Recent Audits</h3>
            {recentAudits.length > 0 ? (
              <div className="space-y-4">
                {recentAudits.map((audit) => (
                  <Card 
                    key={audit.id} 
                    className="cursor-pointer border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1" 
                    onClick={() => navigate(`/audit/result/${audit.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{audit.name}</CardTitle>
                        <Badge className={getScoreColor(audit.score)}>
                          {audit.score}/100
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{new Date(audit.created_at).toLocaleDateString()}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {audit.summary}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto border-gray-200 dark:border-gray-700" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/audit/result/${audit.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {recentAudits.length > 0 && (
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/audit/history")}
                      className="border-gray-200 dark:border-gray-700"
                    >
                      View All Audits
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <CardContent className="pt-6 text-center">
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
                      <FileCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium">No audits yet</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      Start your first smart contract audit to see results here.
                    </p>
                    <Button 
                      onClick={() => navigate("/audit/new")}
                      className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white"
                    >
                      Start Your First Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-bold mb-4">Audit Features</h3>
          <div className="space-y-4">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 p-2">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Security Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Detect vulnerabilities like reentrancy, overflow, and more
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 p-2">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Gas Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Find inefficient code patterns to reduce transaction costs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 p-2">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Code Quality</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluate structure, best practices, and readability
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => navigate("/audit/new")}
                className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white"
              >
                Start New Audit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}