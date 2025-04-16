
import { toast } from "@/components/ui/use-toast";
import { exportToCSV, formatEvaluationResultsForExport } from "@/utils/exportUtils";
import type { EvaluationResults } from "./DatasetEvaluator";

export function useReportDownload() {
  const handleDownloadReport = (results: EvaluationResults | null) => {
    if (!results) return;
    
    try {
      const exportData = formatEvaluationResultsForExport(results, "caesar");
      const filename = `accuracy-report-caesar-${new Date().toISOString().split('T')[0]}.csv`;
      
      exportToCSV(exportData, filename);
      
      toast({
        title: "Report Downloaded",
        description: `Accuracy report has been downloaded as ${filename}`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the report. See console for details.",
        variant: "destructive"
      });
    }
  };

  return { handleDownloadReport };
}
