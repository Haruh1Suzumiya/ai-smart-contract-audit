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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getScoreColor, getScoreLabel } from "@/lib/constants";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileText, MoreVertical, Trash, Eye, Loader2 } from "lucide-react";

export default function AuditHistoryList() {
  const { user } = useAuth();
  const { audits, deleteAudit, loading } = useAudit();
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [auditToDelete, setAuditToDelete] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (audits.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No audits found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven't performed any smart contract audits yet.
            </p>
            <Button onClick={() => navigate("/audit/new")}>
              Start Your First Audit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {audits.map((audit) => (
        <AuditHistoryItem
          key={audit.id}
          audit={audit}
          onView={() => handleViewAudit(audit.id)}
          onDelete={() => openDeleteConfirm(audit.id)}
        />
      ))}
      
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
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
  return (
    <Card className="audit-card card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{audit.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">
            {new Date(audit.created_at).toLocaleDateString()}
          </div>
          <Badge className={getScoreColor(audit.score)}>
            Score: {audit.score}/100 ({getScoreLabel(audit.score)})
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{audit.summary}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onView}>
          View Audit Results
        </Button>
      </CardFooter>
    </Card>
  );
}