
import { ShieldCheck, Lock, Eye } from "lucide-react";

export default function PrivacyNotice() {
  return (
    <section className="bg-secondary/20 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-6 text-foreground">Your Privacy Matters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border fade-in-up" style={{ animationDelay: '0ms' }}>
              <div className="bg-primary/5 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium mb-2 text-foreground">Secure Processing</h3>
              <p className="text-sm text-muted-foreground">
                Your images are processed securely with end-to-end encryption
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-primary/5 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium mb-2 text-foreground">No Image Storage</h3>
              <p className="text-sm text-muted-foreground">
                Your images are processed in memory and not stored on our servers
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-primary/5 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-medium mb-2 text-foreground">GDPR Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Our processes follow strict privacy regulations and best practices
              </p>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Read our full <a href="#" className="text-primary underline">Privacy Policy</a> and <a href="#" className="text-primary underline">Terms of Service</a> for more details.
          </p>
        </div>
      </div>
    </section>
  );
}
