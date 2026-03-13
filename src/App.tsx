import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Auth from "./pages/Auth.tsx";
import AttackSimulation from "./pages/AttackSimulation.tsx";
import NotFound from "./pages/NotFound.tsx";
import Index from "./pages/Index.tsx";

// Security Components
import { AttackMonitor } from "@/components/AttackMonitor";
import NotificationSettings from "@/components/NotificationSettings";
import DigitalTwin from "@/components/DigitalTwin";
import ARAttackVisualizer from "@/components/ARAttackVisualizer";

const queryClient = new QueryClient();


/* ===============================
   DASHBOARD LAYOUT
================================ */

const Dashboard = () => {

  return (

    <div className="space-y-8">

      {/* MAIN CYBER DEFENSE DASHBOARD */}
      <Index />

      <div className="container mx-auto p-6 space-y-8">

        <h1 className="text-3xl font-bold">
          Guardian AI Cyber Defense Platform
        </h1>


        {/* ATTACK MONITORING */}
        <AttackMonitor />


        {/* DIGITAL TWIN HONEYPOT */}
        <DigitalTwin />


        {/* AR ATTACK VISUALIZATION */}

        <div>

          <h2 className="text-xl font-semibold mb-4">

            AR Cyber Attack Visualization

          </h2>

          <ARAttackVisualizer />

        </div>


        {/* NOTIFICATION SETTINGS */}

        <NotificationSettings />

      </div>

    </div>

  );

};


/* ===============================
   MAIN APPLICATION
================================ */

const App = () => (

  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />

      <Sonner />

      <BrowserRouter>

        <AuthProvider>

          <Routes>


            {/* AUTH PAGE */}

            <Route path="/auth" element={<Auth />} />


            {/* MAIN DASHBOARD */}

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />


            {/* ATTACK SIMULATION PAGE */}

            <Route
              path="/simulation"
              element={
                <ProtectedRoute>
                  <AttackSimulation />
                </ProtectedRoute>
              }
            />


            {/* 404 PAGE */}

            <Route path="*" element={<NotFound />} />

          </Routes>

        </AuthProvider>

      </BrowserRouter>

    </TooltipProvider>

  </QueryClientProvider>

);

export default App;