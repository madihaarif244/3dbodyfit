
import { Routes, Route } from "react-router-dom";
import { useDevicePreview } from "@/hooks/use-mobile";
import Index from "@/pages/Index";
import TryItNow from "@/pages/TryItNow";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  const { devicePreview } = useDevicePreview();
  
  // Add classes for mobile preview
  const getPreviewClass = () => {
    if (devicePreview === "mobile") {
      return "mx-auto w-[375px] h-[667px] overflow-y-auto shadow-xl border border-gray-300 rounded-xl mobile-preview-container";
    } else if (devicePreview === "tablet") {
      return "mx-auto w-[768px] h-[1024px] overflow-y-auto shadow-xl border border-gray-300 rounded-xl tablet-preview-container";
    }
    return "";
  };

  return (
    <div className={getPreviewClass()}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/try-it-now" element={<TryItNow />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
