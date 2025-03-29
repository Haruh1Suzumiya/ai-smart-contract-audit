import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import AccountSettings from "@/components/settings/AccountSettings";
import ApiKeySettings from "@/components/settings/ApiKeySettings";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  User, 
  Key, 
  Settings as SettingsIcon,
  Shield
} from "lucide-react";

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  
  useEffect(() => {
    // If user is not logged in and not currently loading auth state, redirect to login
    if (!user && !authLoading) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <SettingsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger 
              value="account" 
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
            >
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger 
              value="api-keys" 
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
            >
              <Key className="h-4 w-4" />
              <span>API Keys</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="api-keys" className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg mb-6">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">API Keys for Smart Contract Audits</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    SecureAudit uses external AI services to provide accurate contract audits. 
                    You need to configure your own API keys to perform audits. Your keys are 
                    securely stored and only used for your own audit requests.
                  </p>
                </div>
              </div>
            </div>
            
            <ApiKeySettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}