import { Shield, ShieldAlert, ShieldCheck, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThreatContext } from '@/context/ThreatContext';
import { cn } from '@/lib/utils';

const MetricsPanel = () => {
  const { threats, totalBlocked, activeThreats, threatScore } = useThreatContext();

  const metrics = [
    {
      label: 'System Status',
      value: activeThreats > 3 ? 'UNDER ATTACK' : activeThreats > 0 ? 'THREATS DETECTED' : 'SECURE',
      icon: activeThreats > 3 ? ShieldAlert : activeThreats > 0 ? Shield : ShieldCheck,
      color: activeThreats > 3 ? 'text-destructive' : activeThreats > 0 ? 'text-warning' : 'text-success',
      bg: activeThreats > 3 ? 'bg-destructive/10' : activeThreats > 0 ? 'bg-warning/10' : 'bg-success/10',
      pulse: activeThreats > 3,
    },
    {
      label: 'Threat Score',
      value: `${threatScore}/10`,
      icon: TrendingUp,
      color: threatScore > 7 ? 'text-destructive' : threatScore > 4 ? 'text-warning' : 'text-success',
      bg: threatScore > 7 ? 'bg-destructive/10' : threatScore > 4 ? 'bg-warning/10' : 'bg-success/10',
      pulse: threatScore > 7,
    },
    {
      label: 'Active Threats',
      value: activeThreats.toString(),
      icon: ShieldAlert,
      color: 'text-warning',
      bg: 'bg-warning/10',
      pulse: false,
    },
    {
      label: 'Total Detected',
      value: threats.length.toString(),
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-primary/10',
      pulse: false,
    },
    {
      label: 'Blocked',
      value: totalBlocked.toString(),
      icon: ShieldCheck,
      color: 'text-success',
      bg: 'bg-success/10',
      pulse: false,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={cn(
            "bg-card border border-border rounded-lg p-4",
            m.pulse && "animate-pulse-threat"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</span>
            <div className={cn("p-1.5 rounded-md", m.bg)}>
              <m.icon className={cn("h-3.5 w-3.5", m.color)} />
            </div>
          </div>
          <p className={cn("text-xl font-bold font-mono", m.color)}>{m.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default MetricsPanel;
