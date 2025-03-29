import { AuditResult, AuditCategory, AuditIssue } from "@/types";
import { getScoreLabel } from "./constants";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// PDFファイルのエクスポート
export const exportToPdf = async (audit: AuditResult) => {
  try {
    // A4サイズのPDFドキュメントを作成
    const doc = new jsPDF();
    
    // ブランディングとヘッダー
    addHeader(doc, audit);
    
    // サマリー情報
    addSummary(doc, audit);
    
    // スコアの詳細
    addScoreTable(doc, audit);
    
    // カテゴリ別の問題点
    addCategories(doc, audit);
    
    // コードのプレビュー（オプション）
    if (audit.code) {
      addCodePreview(doc, audit.code);
    }
    
    // フッター
    addFooter(doc);
    
    // PDFを保存
    const filename = `${audit.name.replace(/\s+/g, '_')}_audit_report.pdf`;
    doc.save(filename);
    
    return true;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw error;
  }
};

// ヘッダー部分の追加
const addHeader = (doc: jsPDF, audit: AuditResult) => {
  // ロゴ代わりのカラーバー
  doc.setFillColor(59, 130, 246); // Tailwindのblue-500に相当
  doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
  
  // タイトル
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Smart Contract Audit Report", 105, 14, { align: "center" });
  
  // プロジェクト名
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(audit.name, 105, 30, { align: "center" });
  
  // 日付
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Audit completed on: ${new Date(audit.created_at).toLocaleDateString()}`, 105, 38, { align: "center" });
  
  // 区切り線
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 42, 190, 42);
};

// 概要情報の追加
const addSummary = (doc: jsPDF, audit: AuditResult) => {
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Audit Summary", 20, 52);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // スコア表示を追加
  const scoreLabel = getScoreLabel(audit.score);
  doc.setDrawColor(200, 200, 200);
  
  // スコアによって色を変更
  const scoreColor = getScoreFillColor(audit.score);
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(150, 45, 40, 20, 3, 3, 'FD');
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`${audit.score}/100`, 170, 54, { align: "center" });
  doc.setFontSize(8);
  doc.text(scoreLabel, 170, 60, { align: "center" });
  
  // サマリーテキスト
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  // 長いテキストの折り返し処理
  const splitSummary = doc.splitTextToSize(audit.summary, 170);
  doc.text(splitSummary, 20, 60);
  
  // 次のセクションのY位置を計算
  const nextY = 60 + (splitSummary.length * 5) + 10;
  return nextY;
};

// スコアテーブルの追加
const addScoreTable = (doc: jsPDF, audit: AuditResult) => {
  const tableData = audit.categories.map(category => [
    category.name,
    `${category.score}/${category.max_score}`,
    ((category.score / category.max_score) * 100).toFixed(1) + "%",
  ]);
  
  autoTable(doc, {
    head: [['Category', 'Score', 'Percentage']],
    body: tableData,
    startY: 90,
    headStyles: {
      fillColor: [59, 130, 246], // Tailwindのblue-500
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 247, 255], // 薄い青色
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
    },
    margin: { left: 20, right: 20 }, // マージンを追加して幅を調整
  });
  
  // 次のセクションのY位置を取得
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 130;
  return finalY;
};

// カテゴリ別の詳細追加
const addCategories = (doc: jsPDF, audit: AuditResult) => {
  let yPos = 130;
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Findings", 20, yPos);
  yPos += 10;
  
  audit.categories.forEach((category, index) => {
    // 新しいページが必要かチェック
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // カテゴリ名
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246); // blue-500
    doc.text(`${index + 1}. ${category.name} (${category.score}/${category.max_score})`, 20, yPos);
    yPos += 6;
    
    // カテゴリの説明
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const descriptionLines = doc.splitTextToSize(category.description, 170);
    doc.text(descriptionLines, 20, yPos);
    yPos += (descriptionLines.length * 5) + 5;
    
    // Issue テーブル
    if (category.issues && category.issues.length > 0) {
      // 安全なissue データを作成
      const safeIssues = category.issues.filter(issue => issue && typeof issue === 'object');
      const issueData = safeIssues.map(issue => [
        issue.title || 'Untitled Issue',
        (issue.severity || 'unknown').toUpperCase(),
        (issue.description || 'No description').substring(0, 50) + 
          ((issue.description || '').length > 50 ? '...' : '')
      ]);
      
      if (issueData.length > 0) {
        autoTable(doc, {
          head: [['Issue', 'Severity', 'Description']],
          body: issueData,
          startY: yPos,
          headStyles: {
            fillColor: [59, 130, 246], // blue-500
            textColor: [255, 255, 255],
          },
          bodyStyles: {
            fontSize: 9,
          },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 60 },
          },
          margin: { left: 20, right: 20 }, // マージンを追加して幅を調整
          didDrawCell: (data) => {
            // 深刻度に応じた色を設定 - セーフチェック付き
            if (data.column.index === 1 && data.section === 'body' && data.row.index < safeIssues.length) {
              const issue = safeIssues[data.row.index];
              if (issue && issue.severity) {
                const severity = issue.severity.toLowerCase();
                const severityColor = getSeverityColor(severity);
                doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
                doc.setTextColor(255, 255, 255);
                doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                
                if (data.cell.text && data.cell.text.length > 0) {
                  doc.text(
                    data.cell.text[0],
                    data.cell.x + data.cell.width / 2,
                    data.cell.y + data.cell.height / 2,
                    { align: 'center', baseline: 'middle' }
                  );
                }
              }
            }
          },
        });
        
        // issueの詳細
        const lastAutoTable = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
        yPos = lastAutoTable?.finalY ? lastAutoTable.finalY + 10 : yPos + 30;
        
        // 各issueの詳細を追加
        safeIssues.forEach((issue, issueIndex) => {
          // 新しいページが必要かチェック
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text(`Issue ${index + 1}.${issueIndex + 1}: ${issue.title || 'Untitled Issue'}`, 20, yPos);
          yPos += 6;
          
          // 説明
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const issueDescLines = doc.splitTextToSize(issue.description || 'No description', 170);
          doc.text(issueDescLines, 20, yPos);
          yPos += (issueDescLines.length * 5) + 5;
          
          // コード参照
          if (issue.code_reference) {
            doc.setFillColor(240, 240, 240); // 薄いグレー
            doc.rect(20, yPos, 170, 15, 'F');
            doc.setFontSize(9);
            doc.setFont("courier", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text(issue.code_reference, 25, yPos + 5);
            yPos += 20;
          }
          
          // 推奨事項
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("Recommendation:", 20, yPos);
          yPos += 5;
          
          doc.setFont("helvetica", "normal");
          const recommendationLines = doc.splitTextToSize(issue.recommendation || 'No recommendation', 170);
          doc.text(recommendationLines, 20, yPos);
          yPos += (recommendationLines.length * 5) + 10;
        });
      } else {
        // issueが適切な形式でなかった場合
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text("Issues data is not in the expected format.", 20, yPos);
        yPos += 10;
      }
    } else {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text("No issues found in this category.", 20, yPos);
      yPos += 10;
    }
    
    // カテゴリ間のスペース
    yPos += 5;
  });
  
  return yPos;
};

// コードプレビューの追加
const addCodePreview = (doc: jsPDF, code: string) => {
  doc.addPage();
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Contract Code", 20, 20);
  
  doc.setFontSize(8); // 文字サイズを小さくして表示を改善
  doc.setFont("courier", "normal");
  
  // コードを行に分割
  const codeLines = code.split('\n');
  
  // 1ページに入る行数
  const linesPerPage = 50;
  let currentY = 30;
  let currentPage = 0;
  
  for (let i = 0; i < codeLines.length; i++) {
    if (i % linesPerPage === 0 && i > 0) {
      doc.addPage();
      currentY = 20;
      currentPage++;
    }
    
    // 行番号を追加
    doc.setTextColor(150, 150, 150);
    doc.text(`${i + 1}.`, 10, currentY);
    
    // コード行を追加
    doc.setTextColor(0, 0, 0);
    const line = codeLines[i].length > 90 ? codeLines[i].substring(0, 87) + '...' : codeLines[i];
    doc.text(line, 20, currentY);
    
    currentY += 5;
  }
};

// フッターの追加
const addFooter = (doc: jsPDF) => {
  try {
    // ページ数を取得 - 内部APIにアクセスするために型を調整
    const internal = doc.internal as unknown as { getNumberOfPages?: () => number };
    const pageCount = internal.getNumberOfPages ? internal.getNumberOfPages() : 1;
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`SecureAudit Report - Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 292, { align: 'center' });
    }
  } catch (error) {
    console.error("Failed to add footer:", error);
    // エラーがあってもPDF生成は続行
  }
};

// スコアに応じた色を取得
const getScoreFillColor = (score: number): [number, number, number] => {
  if (score >= 90) return [16, 185, 129]; // green-500
  if (score >= 75) return [59, 130, 246]; // blue-500
  if (score >= 60) return [245, 158, 11]; // amber-500
  return [239, 68, 68]; // red-500
};

// 深刻度に応じた色を取得
const getSeverityColor = (severity: string): [number, number, number] => {
  switch (severity) {
    case 'high':
      return [239, 68, 68]; // red-500
    case 'medium':
      return [245, 158, 11]; // amber-500
    case 'low':
      return [16, 185, 129]; // green-500
    case 'info':
      return [59, 130, 246]; // blue-500
    case 'safe':
      return [16, 185, 129]; // green-500
    default:
      return [100, 100, 100]; // gray-500
  }
};