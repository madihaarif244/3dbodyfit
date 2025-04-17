
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { MobileProvider } from "./hooks/use-mobile";
import AppRoutes from "./routes";
import DevicePreview from "./components/DevicePreview";
import "./App.css";

// Create a new QueryClient instance
const queryClient = new QueryClientProvider({
  client: {},
  children: null
}).props.client;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MobileProvider>
        <div className="app-container">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
            <DevicePreview />
          </BrowserRouter>
        </div>
      </MobileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
