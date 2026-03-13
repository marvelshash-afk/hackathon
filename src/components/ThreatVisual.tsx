import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Wifi, Lock, Bug, Globe, Zap, Server } from 'lucide-react';
import type { ThreatAlert } from '@/lib/types';

const attackIcons: Record<string, React.ElementType> = {
  'DDoS Attack': Wifi,
  'Brute Force Login': Lock,
  'Port Scanning': Server,
  'SQL Injection': Bug,
  'Malware Traffic': Bug,
  'Phishing Attempt': AlertTriangle,
  'Man-in-the-Middle': Globe,
  'Zero-Day Exploit': Zap,
  'Ransomware': Lock,
  'DNS Spoofing': Globe,
  'XSS Attack': Bug,
  'Buffer Overflow': Server,
};

const severityColors: Record<string, string> = {
  Low: 'from-success/20 to-success/5 border-success/40',
  Medium: 'from-primary/20 to-primary/5 border-primary/40',
  High: 'from-warning/20 to-warning/5 border-warning/40',
  Critical: 'from-destructive/20 to-destructive/5 border-destructive/40',
};

const severityGlow: Record<string, string> = {
  Low: '0 0 30px hsl(160, 84%, 39%, 0.3)',
  Medium: '0 0 30px hsl(187, 94%, 43%, 0.3)',
  High: '0 0 30px hsl(38, 92%, 50%, 0.4)',
  Critical: '0 0 40px hsl(0, 84%, 60%, 0.5)',
};

interface ThreatVisualProps {
  threat: ThreatAlert;
}

const ThreatVisual = ({ threat }: ThreatVisualProps) => {
  const Icon = attackIcons[threat.type] || AlertTriangle;
  const colorClass = severityColors[threat.severity] || severityColors.Medium;
  const glow = severityGlow[threat.severity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-xl border bg-gradient-to-br p-4 ${colorClass} overflow-hidden`}
      style={{ boxShadow: glow }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground/10"
            animate={{
              x: [0, Math.random() * 60 - 30],
              y: [0, Math.random() * 60 - 30],
              opacity: [0, 0.5, 0],
            }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* Attack visualization */}
      <div className="relative flex items-start gap-3">
        {/* Animated icon */}
        <motion.div
          animate={threat.severity === 'Critical' ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : { scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-card/80 flex items-center justify-center">
            <Icon className={`h-5 w-5 ${
              threat.severity === 'Critical' ? 'text-destructive' :
              threat.severity === 'High' ? 'text-warning' :
              threat.severity === 'Medium' ? 'text-primary' : 'text-success'
            }`} />
          </div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">{threat.type}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
              threat.severity === 'Critical' ? 'bg-destructive/30 text-destructive' :
              threat.severity === 'High' ? 'bg-warning/30 text-warning' :
              threat.severity === 'Medium' ? 'bg-primary/30 text-primary' : 'bg-success/30 text-success'
            }`}>
              {threat.severity} • {threat.score}/10
            </span>
          </div>

          {/* Attack flow animation */}
          <div className="flex items-center gap-1 my-2">
            <div className="text-[9px] font-mono text-muted-foreground bg-card/60 px-1.5 py-0.5 rounded">
              {threat.sourceIp}
            </div>
            <motion.div className="flex gap-0.5" animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1.5 h-0.5 rounded-full ${
                    threat.severity === 'Critical' ? 'bg-destructive' : threat.severity === 'High' ? 'bg-warning' : 'bg-primary'
                  }`}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
            <div className="text-[9px] font-mono text-muted-foreground bg-card/60 px-1.5 py-0.5 rounded flex items-center gap-1">
              <Shield className="h-2.5 w-2.5 text-primary" />
              Your Server
            </div>
          </div>

          <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span>{threat.sourceCountry}</span>
            <span>•</span>
            <span>{threat.timestamp.toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatVisual;
