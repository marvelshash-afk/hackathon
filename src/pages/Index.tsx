import { useState } from 'react';
import { ThreatProvider } from '@/context/ThreatContext';
import Sidebar from '@/components/Sidebar';
import MetricsPanel from '@/components/MetricsPanel';
import NetworkTrafficChart from '@/components/NetworkTrafficChart';
import AttackTable from '@/components/AttackTable';
import AttackMap from '@/components/AttackMap';
import BlockchainLedger from '@/components/BlockchainLedger';
import RecommendationPanel from '@/components/RecommendationPanel';
import AIAssistant from '@/components/AIAssistant';
import ReportGenerator from '@/components/ReportGenerator';
import NotificationSettings from '@/components/NotificationSettings';
import ServerDashboard from "@/pages/ServerDashboard";   // NEW IMPORT
import AIChatbot from "@/pages/AIChatbot";
import SOCDashboard from "@/pages/SOCDashboard";

const DashboardContent = () => {

  const [activeView, setActiveView] = useState('dashboard');

  return (

    <div className="flex h-screen overflow-hidden">

      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 overflow-auto bg-background p-4">

        {/* =========================
           MAIN DASHBOARD
        ========================= */}

        {activeView === 'dashboard' && (

          <div className="space-y-3 max-w-[1600px] mx-auto">

            <MetricsPanel />

            <div className="grid grid-cols-3 gap-3" style={{ height: '280px' }}>

              <div className="col-span-2">

                <AttackMap />

              </div>

              <NetworkTrafficChart />

            </div>

            <div className="grid grid-cols-3 gap-3" style={{ height: '350px' }}>

              <div className="col-span-2">

                <AttackTable />

              </div>

              <RecommendationPanel />

            </div>

          </div>

        )}



        {/* =========================
           DIGITAL TWIN SERVERS
        ========================= */}

        {activeView === 'servers' && (

          <div className="max-w-[1600px] mx-auto space-y-3 h-[calc(100vh-100px)]">

            <h2 className="text-lg font-bold text-foreground">

              Server Infrastructure Status

            </h2>

            <div className="h-full pb-8">

              <ServerDashboard />

            </div>

          </div>

        )}



        {/* =========================
           LIVE LOGS
        ========================= */}

        {activeView === 'logs' && (

          <div className="max-w-[1600px] mx-auto space-y-3">

            <h2 className="text-lg font-bold text-foreground">

              Live Attack Logs

            </h2>

            <div style={{ height: 'calc(100vh - 120px)' }}>

              <AttackTable />

            </div>

          </div>

        )}



        {/* =========================
           BLOCKCHAIN
        ========================= */}

        {activeView === 'blockchain' && (

          <div className="max-w-[1600px] mx-auto space-y-3">

            <h2 className="text-lg font-bold text-foreground">

              Blockchain Security Ledger

            </h2>

            <div style={{ height: 'calc(100vh - 120px)' }}>

              <BlockchainLedger />

            </div>

          </div>

        )}

    

        {/* =========================
           REPORTS
        ========================= */}

        {activeView === 'reports' && (

          <div className="max-w-[1600px] mx-auto space-y-3">

            <h2 className="text-lg font-bold text-foreground">

              Security Reports

            </h2>

            <ReportGenerator />

          </div>

        )}



        {/* =========================
           SETTINGS
        ========================= */}

        {activeView === 'settings' && (

          <div className="max-w-[1600px] mx-auto space-y-3">

            <h2 className="text-lg font-bold text-foreground">

              Settings & Notifications

            </h2>

            <NotificationSettings />

          </div>

        )}
       {activeView === "ai-chatbot" && (

  <div className="max-w-[1600px] mx-auto">

    <AIChatbot />

  </div>

)}
{activeView === "ai-soc" && (
  <SOCDashboard />
)}

      </main>

      <AIAssistant />

    </div>

  );

};


const Index = () => (

  <ThreatProvider>

    <DashboardContent />

  </ThreatProvider>

);

export default Index;