
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
import { BarChart3, FileCheck, AlertTriangle, Clock, Plus } from "lucide-react";

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
    const criticalIssues = audit.categories.flatMap(cat => 
      cat.issues.filter(issue => issue.severity === "high")
    );
    return count + criticalIssues.length;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your smart contract audits</p>
        </div>
        <Button onClick={() => navigate("/audit/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Audit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-primary" />
              <span className="text-2xl font-bold">{totalAudits}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              <span className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
                {avgScore}/100
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              <span className="text-2xl font-bold">
                {criticalVulnerabilities}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-bold mb-4">Recent Audits</h3>
        {recentAudits.length > 0 ? (
          <div className="space-y-4">
            {recentAudits.map((audit) => (
              <Card key={audit.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/audit/result/${audit.id}`)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{audit.name}</CardTitle>
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
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/audit/result/${audit.id}`);
                  }}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center justify-center py-8">
                <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No audits yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your first smart contract audit to see results here.
                </p>
                <Button onClick={() => navigate("/audit/new")}>
                  Start Your First Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
