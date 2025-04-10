
import { ShieldCheck, Lock, Eye } from "lucide-react";

export default function PrivacyNotice() {
  return (
    <section className="bg-gray-50 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Your Privacy Matters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-electric/10 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-electric" />
              </div>
              <h3 className="font-medium mb-2">Secure Processing</h3>
              <p className="text-sm text-gray-600">
                Your images are processed securely with end-to-end encryption
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-electric/10 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-7 h-7 text-electric" />
              </div>
              <h3 className="font-medium mb-2">No Image Storage</h3>
              <p className="text-sm text-gray-600">
                Your images are processed in memory and not stored on our servers
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-electric/10 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <Eye className="w-7 h-7 text-electric" />
              </div>
              <h3 className="font-medium mb-2">GDPR Compliant</h3>
              <p className="text-sm text-gray-600">
                Our processes follow strict privacy regulations and best practices
              </p>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            Read our full <a href="#" className="text-electric underline">Privacy Policy</a> and <a href="#" className="text-electric underline">Terms of Service</a> for more details.
          </p>
        </div>
      </div>
    </section>
  );
}
