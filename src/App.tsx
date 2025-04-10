
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TryItNow from "./pages/TryItNow";
import NotFound from "./pages/NotFound";
import DevicePreview from "./components/DevicePreview";
import { MobileProvider, useDevicePreview } from "./hooks/use-mobile";
import "./App.css";

const queryClient = new QueryClient();

const AppContent = () => {
  const { devicePreview } = useDevicePreview();
  
  // Add classes for mobile preview
  const getPreviewClass = () => {
    if (devicePreview === "mobile") {
      return "mx-auto w-[375px] h-[667px] overflow-y-auto shadow-xl border border-gray-300 rounded-xl";
    } else if (devicePreview === "tablet") {
      return "mx-auto w-[768px] h-[1024px] overflow-y-auto shadow-xl border border-gray-300 rounded-xl";
    }
    return "";
  };

  return (
    <div className="app-container">
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className={getPreviewClass()}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/try-it-now" element={<TryItNow />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <DevicePreview />
      </BrowserRouter>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MobileProvider>
        <AppContent />
      </MobileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
