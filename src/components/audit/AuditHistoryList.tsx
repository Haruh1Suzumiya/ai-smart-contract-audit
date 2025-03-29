import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAudit } from "@/contexts/AuditContext";
import { useAuth } from "@/contexts/AuthContext";
import { AuditResult } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getScoreColor, getScoreLabel } from "@/lib/constants";
import { FileText, MoreVertical, Trash, Eye, Loader2, Calendar, ShieldAlert, Sparkles } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export default function AuditHistoryList() {
  const { user } = useAuth();
  const { audits, deleteAudit, loading } = useAudit();
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [auditToDelete, setAuditToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [filterScore, setFilterScore] = useState<string | null>(null);

  const handleViewAudit = (id: string) => {
    navigate(`/audit/result/${id}`);
  };

  const openDeleteConfirm = (id: string) => {
    setAuditToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!auditToDelete) return;
    
    try {
      await deleteAudit(auditToDelete);
      toast.success("Audit deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleteConfirmOpen(false);
      setAuditToDelete(null);
    }
  };

  // Sort and filter audits
  const getSortedAndFilteredAudits = () => {
    let filteredAudits = [...audits];
    
    // Apply score filtering
    if (filterScore) {
      const [min, max] = filterScore.split('-').map(Number);
      filteredAudits = filteredAudits.filter(audit => 
        audit.score >= min && audit.score <= max
      );
    }
    
    // Apply sorting
    if (sortBy === 'date') {
      return filteredAudits.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      return filteredAudits.sort((a, b) => b.score - a.score);
    }
  };

  const sortedAndFilteredAudits = getSortedAndFilteredAudits();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (audits.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No audits found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              You haven't performed any smart contract audits yet. Start your first audit to secure your blockchain projects.
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={sortBy === 'date' ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy('date')}
            className={sortBy === 'date' ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 dark:border-gray-700"}
          >
            <Calendar className="mr-1 h-4 w-4" />
            Date
          </Button>
          <Button
            variant={sortBy === 'score' ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy('score')}
            className={sortBy === 'score' ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 dark:border-gray-700"}
          >
            <ShieldAlert className="mr-1 h-4 w-4" />
            Score
          </Button>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={filterScore === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterScore(null)}
            className={filterScore === null ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 dark:border-gray-700"}
          >
            All
          </Button>
          <Button
            variant={filterScore === "90-100" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterScore("90-100")}
            className={filterScore === "90-100" ? "bg-green-600 hover:bg-green-700" : "border-gray-300 dark:border-gray-700"}
          >
            Excellent
          </Button>
          <Button
            variant={filterScore === "70-89" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterScore("70-89")}
            className={filterScore === "70-89" ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 dark:border-gray-700"}
          >
            Good
          </Button>
          <Button
            variant={filterScore === "0-69" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterScore("0-69")}
            className={filterScore === "0-69" ? "bg-red-600 hover:bg-red-700" : "border-gray-300 dark:border-gray-700"}
          >
            At Risk
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredAudits.map((audit) => (
          <AuditHistoryItem
            key={audit.id}
            audit={audit}
            onView={() => handleViewAudit(audit.id)}
            onDelete={() => openDeleteConfirm(audit.id)}
          />
        ))}
      </div>
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              audit and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface AuditHistoryItemProps {
  audit: AuditResult;
  onView: () => void;
  onDelete: () => void;
}

function AuditHistoryItem({ audit, onView, onDelete }: AuditHistoryItemProps) {
  // Calculate how long ago the audit was performed
  const timeAgo = formatDistanceToNow(new Date(audit.created_at), { addSuffix: true });
  
  // Count critical/high issues (if available)
  const getCriticalIssuesCount = () => {
    if (!audit.categories) return 0;
    
    return audit.categories.reduce((count, category) => {
      if (!category.issues) return count;
      return count + category.issues.filter(issue => issue.severity === "high").length;
    }, 0);
  };
  
  const criticalIssues = getCriticalIssuesCount();

  return (
    <Card 
      className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
      onClick={onView}
    >
      <div className={`h-1 ${getScoreColor(audit.score).replace('text-', 'bg-')}`}></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate pr-8">{audit.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 absolute right-4 top-4" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onView();
              }}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }} 
                className="text-red-500 focus:text-red-500"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{timeAgo}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <ShieldAlert className={`h-4 w-4 ${criticalIssues > 0 ? 'text-red-500' : 'text-green-500'}`} />
            <span className="text-sm">{criticalIssues} critical issue{criticalIssues !== 1 ? 's' : ''}</span>
          </div>
          <Badge className={getScoreColor(audit.score)}>
            {audit.score}/100
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{audit.summary}</p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <div className="flex w-full justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
            <span>{getScoreLabel(audit.score)}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 -mr-2"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            View Details
            <Eye className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}