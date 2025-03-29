import { useNavigate } from "react-router-dom";
import { AuditResult, AuditCategory, AuditIssue } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getScoreColor, getScoreLabel, SEVERITY_COLORS } from "@/lib/constants";
import { toast } from "sonner";
import { exportToPdf } from "@/lib/pdf-utils";
import { 
  Download, 
  Code, 
  FileText, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle,
  PieChart,
  ExternalLink, 
  Copy,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface AuditResultsProps {
  audit: AuditResult;
}

export default function AuditResults({ audit }: AuditResultsProps) {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await exportToPdf(audit);
      toast.success("Audit exported successfully to PDF");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export audit");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(audit.code);
    toast.success("Code copied to clipboard");
  };

  const goBack = () => {
    navigate("/audit/history");
  };

  // Generate categorized issue counts
  const getIssueCounts = () => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      safe: 0
    };
    
    if (!audit.categories) return counts;
    
    audit.categories.forEach(category => {
      if (!category.issues) return;
      
      category.issues.forEach(issue => {
        if (issue.severity in counts) {
          counts[issue.severity as keyof typeof counts]++;
        }
      });
    });
    
    return counts;
  };
  
  const issueCounts = getIssueCounts();
  const timeAgo = formatDistanceToNow(new Date(audit.created_at), { addSuffix: true });
  const totalIssues = Object.values(issueCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Button 
            variant="ghost" 
            className="flex items-center text-gray-500 dark:text-gray-400 mb-2 -ml-2 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={goBack}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Back to Audit History</span>
          </Button>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{audit.name}</h2>
          <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">Completed {timeAgo}</span>
          </div>
        </div>
        <div className="flex gap-2 self-stretch md:self-auto">
          <Button 
            variant="outline" 
            onClick={handleExportPdf} 
            className="flex-1 md:flex-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Export PDF</span>
          </Button>
          <Button 
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={() => navigate("/audit/new")}
          >
            <Code className="mr-2 h-4 w-4" />
            <span>New Audit</span>
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-violet-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-medium">Overall Score</h3>
              <p className="text-sm text-white/80">Based on security analysis of your smart contract</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <h4 className="text-4xl font-bold">{audit.score}</h4>
                <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                  out of 100
                </div>
              </div>
              <p className={`text-sm font-medium mt-1 ${
                audit.score >= 90 ? "text-green-300" : 
                audit.score >= 75 ? "text-blue-300" : 
                audit.score >= 60 ? "text-yellow-300" : 
                "text-red-300"
              }`}>
                {getScoreLabel(audit.score)}
              </p>
            </div>
          </div>
          <Progress 
            value={audit.score} 
            className="mt-4 h-2 bg-white/20" 
          />
        </div>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Summary</h3>
            <p className="text-gray-600 dark:text-gray-300">{audit.summary}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="col-span-2 md:col-span-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Issues by Severity</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">High</span>
                  </div>
                  <span className="text-sm font-medium">{issueCounts.high}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Medium</span>
                  </div>
                  <span className="text-sm font-medium">{issueCounts.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Low</span>
                  </div>
                  <span className="text-sm font-medium">{issueCounts.low}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <span className="text-sm">Informational</span>
                  </div>
                  <span className="text-sm font-medium">{issueCounts.info}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Safe</span>
                  </div>
                  <span className="text-sm font-medium">{issueCounts.safe}</span>
                </div>
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-4">
              {audit.categories && audit.categories.map((category, index) => (
                <Card key={index} className="border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${getScoreColor(Math.round((category.score / category.max_score) * 100))}`}>
                        {category.score}/{category.max_score}
                      </span>
                      <Progress 
                        value={(category.score / category.max_score) * 100} 
                        className="w-16 h-1.5" 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <Tabs defaultValue="issues" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger 
                value="issues" 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Findings</span>
                {totalIssues > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium">
                    {totalIssues}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="code" 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
              >
                <Code className="h-4 w-4" />
                <span>Contract Code</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="issues" className="space-y-6">
              {audit.categories && audit.categories.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {audit.categories.map((category, categoryIndex) => (
                    <AccordionItem key={categoryIndex} value={`category-${categoryIndex}`} className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800/50 data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-gray-800/50">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 w-8 h-8 flex items-center justify-center">
                              <PieChart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex space-x-3 items-center">
                            <div className="flex items-center space-x-1">
                              {category.issues && category.issues.some(i => i.severity === 'high') && (
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              )}
                              {category.issues && category.issues.some(i => i.severity === 'medium') && (
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                              )}
                              {category.issues && category.issues.some(i => i.severity === 'low') && (
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              )}
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(Math.round((category.score / category.max_score) * 100))}`}>
                              {category.score}/{category.max_score}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-white dark:bg-gray-900 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-4">
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{category.description}</p>
                          
                          <div className="space-y-4">
                            {category.issues && category.issues.map((issue, issueIndex) => (
                              <IssueCard 
                                key={issueIndex}
                                issue={issue}
                              />
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No issues found</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Your smart contract appears to be well-written and secure. No issues were detected during the audit.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="code">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contract Code</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyCode}
                    className="h-8 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Copy</span>
                  </Button>
                </div>
                <div className="overflow-auto h-[500px] p-4 font-mono text-sm">
                  <pre className="whitespace-pre-wrap break-words">{audit.code}</pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface IssueCardProps {
  issue: AuditIssue;
}

function IssueCard({ issue }: IssueCardProps) {
  const severityColors = {
    high: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30",
    medium: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30",
    low: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30",
    info: "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
    safe: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30"
  };
  
  const severityTextColors = {
    high: "text-red-800 dark:text-red-300",
    medium: "text-yellow-800 dark:text-yellow-300",
    low: "text-blue-800 dark:text-blue-300",
    info: "text-gray-800 dark:text-gray-300",
    safe: "text-green-800 dark:text-green-300"
  };
  
  const severityBadgeColors = {
    high: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/30",
    medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30",
    low: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/30",
    info: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
    safe: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/30"
  };

  return (
    <div className={`rounded-lg border ${severityColors[issue.severity]} p-4`}>
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className={`font-medium ${severityTextColors[issue.severity]}`}>{issue.title}</h4>
            <div className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${severityBadgeColors[issue.severity]}`}>
              {issue.severity.toUpperCase()}
            </div>
          </div>
          
          <p className={`text-sm mb-4 ${severityTextColors[issue.severity]}`}>{issue.description}</p>
          
          {issue.code_reference && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
              <pre className="text-xs font-mono text-gray-800 dark:text-gray-200">{issue.code_reference}</pre>
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <h5 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Recommendation:</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">{issue.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}