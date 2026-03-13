import { motion } from 'framer-motion';
import { ShieldBan, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useThreatContext } from '@/context/ThreatContext';
import { cn } from '@/lib/utils';
import { SeverityLevel } from '@/lib/types';

const severityColor: Record<SeverityLevel, string> = {
  Low: 'text-success',
  Medium: 'text-warning',
  High: 'text-destructive',
  Critical: 'text-destructive',
};
const severityBg: Record<SeverityLevel, string> = {
  Low: 'bg-success/10',
  Medium: 'bg-warning/10',
  High: 'bg-destructive/10',
  Critical: 'bg-destructive/20',
};

const AttackTable = () => {
  const { threats, blockThreat } = useThreatContext();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Detected Attacks</h3>
        <span className="text-[10px] text-muted-foreground font-mono">{threats.length} TOTAL</span>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card">
            <tr className="text-muted-foreground uppercase tracking-wider text-[10px]">
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Source IP</th>
              <th className="text-left px-4 py-2">Country</th>
              <th className="text-left px-4 py-2">Severity</th>
              <th className="text-left px-4 py-2">Score</th>
              <th className="text-left px-4 py-2">Time</th>
              <th className="text-left px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {threats.slice(0, 20).map((threat, i) => (
              <motion.tr
                key={threat.id}
                initial={i === 0 ? { opacity: 0, backgroundColor: 'hsl(0 84% 60% / 0.1)' } : {}}
                animate={{ opacity: 1, backgroundColor: 'transparent' }}
                transition={{ duration: 1 }}
                className={cn(
                  "border-b border-border/50 hover:bg-accent/50 transition-colors",
                  !threat.blocked && threat.severity === 'Critical' && "bg-destructive/5"
                )}
              >
                <td className="px-4 py-2.5 font-medium text-foreground flex items-center gap-1.5">
                  <AlertTriangle className={cn("h-3 w-3", severityColor[threat.severity])} />
                  {threat.type}
                </td>
                <td className="px-4 py-2.5 font-mono text-muted-foreground">{threat.sourceIp}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{threat.sourceCountry}</td>
                <td className="px-4 py-2.5">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", severityBg[threat.severity], severityColor[threat.severity])}>
                    {threat.severity}
                  </span>
                </td>
                <td className={cn("px-4 py-2.5 font-mono font-bold", severityColor[threat.severity])}>
                  {threat.score}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono">
                  {threat.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                </td>
                <td className="px-4 py-2.5">
                  {threat.blocked ? (
                    <span className="flex items-center gap-1 text-success text-[10px]">
                      <ShieldCheck className="h-3 w-3" /> Blocked
                    </span>
                  ) : (
                    <button
                      onClick={() => blockThreat(threat.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-[10px] font-semibold"
                    >
                      <ShieldBan className="h-3 w-3" /> Block
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttackTable;
