
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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getScoreColor, getScoreLabel, SEVERITY_COLORS } from "@/lib/constants";
import { toast } from "sonner";
import { exportToPdf } from "@/lib/pdf-utils";
import { Download, Code, FileText, ArrowLeft } from "lucide-react";

interface AuditResultsProps {
  audit: AuditResult;
}

export default function AuditResults({ audit }: AuditResultsProps) {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await exportToPdf(audit);
      toast.success("Audit exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export audit");
    }
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Button 
            variant="ghost" 
            className="mb-2 -ml-2 flex items-center text-muted-foreground"
            onClick={goBack}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          <h2 className="text-2xl font-bold">{audit.name}</h2>
          <p className="text-muted-foreground">
            Audit completed on {new Date(audit.created_at).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={handleExportPdf} className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          <span>Export PDF</span>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="gradient-bg p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-medium">Overall Score</h3>
              <p className="text-sm opacity-80">Based on all audit categories</p>
            </div>
            <div className="text-right">
              <h4 className="text-4xl font-bold">{audit.score}/100</h4>
              <p className={`text-sm font-medium ${audit.score >= 90 ? "text-green-300" : audit.score >= 75 ? "text-blue-300" : audit.score >= 60 ? "text-yellow-300" : "text-red-300"}`}>
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
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Summary</h3>
            <p className="text-muted-foreground">{audit.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {audit.categories.map((category) => (
              <Card key={category.name} className="audit-card card-hover">
                <div className="flex flex-col h-full">
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2 flex-grow">
                    {category.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${getScoreColor(Math.round((category.score / category.max_score) * 100))}`}>
                      {category.score}/{category.max_score}
                    </span>
                    <Progress 
                      value={(category.score / category.max_score) * 100} 
                      className="w-24 h-2" 
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <Tabs defaultValue="issues" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="issues" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Findings</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Contract Code</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="issues" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {audit.categories.map((category, categoryIndex) => (
                  <AccordionItem key={categoryIndex} value={`category-${categoryIndex}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span>{category.name}</span>
                        <div className="flex space-x-2 items-center">
                          <span className={`text-sm font-medium ${getScoreColor(Math.round((category.score / category.max_score) * 100))}`}>
                            {category.score}/{category.max_score}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 py-2">
                        {category.issues.map((issue, issueIndex) => (
                          <IssueCard 
                            key={issueIndex}
                            issue={issue}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            <TabsContent value="code">
              <div className="code-block h-[500px] overflow-auto">
                <pre>{audit.code}</pre>
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
  return (
    <Alert variant={issue.severity === "safe" ? "default" : "destructive"}>
      <div className="flex items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <AlertTitle>{issue.title}</AlertTitle>
            <Badge className={`${SEVERITY_COLORS[issue.severity]}`}>
              {issue.severity.toUpperCase()}
            </Badge>
          </div>
          <AlertDescription className="mt-2 space-y-2">
            <p>{issue.description}</p>
            
            {issue.code_reference && (
              <div className="bg-muted p-2 rounded text-xs font-mono mt-2">
                {issue.code_reference}
              </div>
            )}
            
            <div className="mt-2">
              <strong className="text-sm">Recommendation:</strong>
              <p className="text-sm">{issue.recommendation}</p>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
