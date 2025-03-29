
import { AuditResult } from "@/types";
import { getScoreColor, getScoreLabel } from "./constants";

// This is a placeholder for jsPDF implementation
// In a real implementation, we would use jsPDF to generate PDFs
export const exportToPdf = async (audit: AuditResult) => {
  try {
    // In a real app, this would use jsPDF to generate a PDF
    console.log("Exporting audit to PDF:", audit);
    
    // Create a fake download by creating a blob and downloading it
    const blob = new Blob([JSON.stringify(audit, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${audit.name.replace(/\s+/g, '_')}_audit_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw error;
  }
};

// In a real implementation, we would use jsPDF to properly format the audit result
export const formatAuditForPdf = (audit: AuditResult) => {
  return `
  # Smart Contract Audit Report
  
  ## ${audit.name}
  
  **Overall Score:** ${audit.score}/100 (${getScoreLabel(audit.score)})
  **Date:** ${new Date(audit.created_at).toLocaleDateString()}
  
  ## Summary
  ${audit.summary}
  
  ## Categories
  ${audit.categories.map(category => `
  ### ${category.name} (${category.score}/${category.max_score})
  
  ${category.description}
  
  ${category.issues.map(issue => `
  #### ${issue.title} - ${issue.severity.toUpperCase()}
  
  ${issue.description}
  
  ${issue.code_reference ? `**Code Reference:** ${issue.code_reference}` : ''}
  
  **Recommendation:** ${issue.recommendation}
  `).join('\n')}
  `).join('\n')}
  
  ## Reviewed Code
  \`\`\`solidity
  ${audit.code}
  \`\`\`
  `;
};
