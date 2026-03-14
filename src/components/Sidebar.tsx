import { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  ScrollText, 
  FileText, 
  Settings, 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  MonitorPlay, 
  LogOut, 
  Bell, 
  User,
  Server,
  Cpu
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useThreatContext } from '@/context/ThreatContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';


/* ===============================
   UPDATED NAV ITEMS
================================ */

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },

  { icon: Server, label: 'Servers', id: 'servers' },   // NEW PAGE

  { icon: Activity, label: 'Live Logs', id: 'logs' },

  { icon: ScrollText, label: 'Blockchain', id: 'blockchain' },
  
  { icon: Cpu, label: 'AI SOC', id: 'ai-soc' },

  { icon: FileText, label: 'Reports', id: 'reports' },

  { icon: Settings, label: 'Settings', id: 'settings' },
];


interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}


const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {

  const [collapsed, setCollapsed] = useState(false);

  const { activeThreats, isSimulating, toggleSimulation, simulateAttack } = useThreatContext();

  const { signOut, user } = useAuth();


  return (

    <div className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-60"
    )}>


      {/* ===============================
          LOGO SECTION
      =============================== */}

      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">

        <Shield className="h-7 w-7 text-primary flex-shrink-0" />

        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-wide">
              THREAT ZERO
            </h1>

            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Cyber Defense
            </p>
          </div>
        )}

      </div>


      {/* ===============================
          NAVIGATION MENU
      =============================== */}

      <nav className="flex-1 py-4 space-y-1 px-2">

        {navItems.map(item => (

          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}

            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm transition-colors",

              activeView === item.id
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
            )}
          >

            <item.icon className="h-4 w-4 flex-shrink-0" />

            {!collapsed && <span>{item.label}</span>}

            {item.id === 'dashboard' && activeThreats > 0 && !collapsed && (

              <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">

                {activeThreats}

              </span>

            )}

          </button>

        ))}


        {/* ===============================
            SIMULATION PAGE
        =============================== */}

        <Link
          to="/simulation"

          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
        >

          <MonitorPlay className="h-4 w-4 flex-shrink-0" />

          {!collapsed && <span>Simulation</span>}

        </Link>

      </nav>



      {/* ===============================
          FOOTER BUTTONS
      =============================== */}

      <div className="p-2 border-t border-sidebar-border space-y-2">

        {!collapsed && (

          <>

            {/* Simulate Attack */}

            <button
              onClick={simulateAttack}

              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >

              <Zap className="h-4 w-4" />

              Simulate Attack

            </button>


            {/* Auto Simulation */}

            <button
              onClick={toggleSimulation}

              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors",

                isSimulating
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              )}
            >

              <Activity className="h-4 w-4" />

              {isSimulating ? 'Auto-Sim: ON' : 'Auto-Sim: OFF'}

            </button>


            {/* Notification Settings */}

            <button
              onClick={() => onViewChange('settings')}

              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
            >

              <Bell className="h-4 w-4" />

              Notifications

            </button>


            {/* Logout */}

            <button
              onClick={signOut}

              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
            >

              <LogOut className="h-4 w-4" />

              Sign Out

            </button>

          </>

        )}


        {/* Collapse Sidebar */}

        <button
          onClick={() => setCollapsed(!collapsed)}

          className="flex items-center justify-center w-full px-3 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >

          {collapsed
            ? <ChevronRight className="h-4 w-4" />
            : <ChevronLeft className="h-4 w-4" />
          }

        </button>

      </div>

    </div>

  );

};

export default Sidebar;