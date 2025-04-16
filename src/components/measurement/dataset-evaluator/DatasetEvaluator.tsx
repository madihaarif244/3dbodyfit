
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download } from "lucide-react";

import EvaluationForm from "./EvaluationForm";
import ResultsSummary from "./ResultsSummary";
import DetailedAnalysis from "./DetailedAnalysis";
import { useDatasetEvaluation } from "./useDatasetEvaluation";
import { useReportDownload } from "./useReportDownload";

export interface DatasetEvaluatorProps {
  measurements: Record<string, number>;
}

export default function DatasetEvaluator({ measurements }: DatasetEvaluatorProps) {
  const { 
    datasetSize, 
    setDatasetSize, 
    accuracyLevel, 
    setAccuracyLevel, 
    isLoading, 
    results, 
    handleEvaluate 
  } = useDatasetEvaluation(measurements);
  
  const { handleDownloadReport } = useReportDownload();

  return (
    <Card className="bg-card border-none shadow-lg text-card-foreground max-w-4xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white text-center">CAESAR Dataset Evaluation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EvaluationForm 
          datasetSize={datasetSize}
          setDatasetSize={setDatasetSize}
          accuracyLevel={accuracyLevel}
          setAccuracyLevel={setAccuracyLevel}
          isLoading={isLoading}
          onEvaluate={handleEvaluate}
        />
        
        {results && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            </TabsList>
            <ResultsSummary results={results} />
            <DetailedAnalysis results={results} />
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {results && (
          <Button 
            variant="outline" 
            className="w-full gap-2 text-sm text-white"
            onClick={() => handleDownloadReport(results)}
          >
            <Download className="h-4 w-4" /> Download Accuracy Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
