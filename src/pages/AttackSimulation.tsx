import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Shield, AlertTriangle, Wifi, Database, Globe, ArrowLeft, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateThreat } from '@/lib/mock-data';
import type { ThreatAlert } from '@/lib/types';

interface ServerNode {
  id: string;
  name: string;
  icon: React.ElementType;
  x: number;
  y: number;
  status: 'online' | 'under-attack' | 'blocked';
}

const servers: ServerNode[] = [
  { id: 'web', name: 'Web Server', icon: Globe, x: 50, y: 20, status: 'online' },
  { id: 'app', name: 'App Server', icon: Server, x: 25, y: 45, status: 'online' },
  { id: 'db', name: 'Database', icon: Database, x: 75, y: 45, status: 'online' },
  { id: 'fw', name: 'Firewall', icon: Shield, x: 50, y: 70, status: 'online' },
  { id: 'net', name: 'Network', icon: Wifi, x: 50, y: 95, status: 'online' },
];

const connections = [
  ['net', 'fw'], ['fw', 'app'], ['fw', 'db'], ['app', 'web'], ['db', 'web'],
];

const AttackSimulation = () => {
  const [nodes, setNodes] = useState<ServerNode[]>(servers);
  const [attacks, setAttacks] = useState<(ThreatAlert & { targetId: string })[]>([]);
  const [attackPackets, setAttackPackets] = useState<{ id: string; fromX: number; fromY: number; toX: number; toY: number; color: string }[]>([]);
  const [log, setLog] = useState<string[]>(['[SYSTEM] Simulation environment initialized.']);
  const [autoMode, setAutoMode] = useState(false);

  const launchAttack = useCallback(() => {
    const threat = generateThreat();
    const targetNode = nodes[Math.floor(Math.random() * nodes.length)];

    setAttacks(prev => [...prev, { ...threat, targetId: targetNode.id }]);
    setNodes(prev => prev.map(n => n.id === targetNode.id ? { ...n, status: 'under-attack' } : n));
    setLog(prev => [...prev, `[ALERT] ${threat.type} detected targeting ${targetNode.name} from ${threat.sourceIp} (${threat.sourceCountry})`]);

    // Animate attack packet from bottom to target
    const packet = {
      id: crypto.randomUUID(),
      fromX: 50,
      fromY: 100,
      toX: targetNode.x,
      toY: targetNode.y,
      color: threat.severity === 'Critical' ? 'hsl(0, 84%, 60%)' : threat.severity === 'High' ? 'hsl(38, 92%, 50%)' : 'hsl(187, 94%, 43%)',
    };
    setAttackPackets(prev => [...prev, packet]);
    setTimeout(() => setAttackPackets(prev => prev.filter(p => p.id !== packet.id)), 2000);

    // Auto-block after delay
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === targetNode.id ? { ...n, status: 'blocked' } : n));
      setLog(prev => [...prev, `[BLOCKED] ${threat.type} on ${targetNode.name} — IP ${threat.sourceIp} blocked`]);
      setTimeout(() => {
        setNodes(prev => prev.map(n => n.id === targetNode.id ? { ...n, status: 'online' } : n));
      }, 2000);
    }, 3000);
  }, [nodes]);

  useEffect(() => {
    if (!autoMode) return;
    const interval = setInterval(launchAttack, 4000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [autoMode, launchAttack]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under-attack': return 'text-destructive animate-pulse-threat';
      case 'blocked': return 'text-warning';
      default: return 'text-success';
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'under-attack': return 'border-destructive shadow-[0_0_20px_hsl(0_84%_60%/0.5)]';
      case 'blocked': return 'border-warning shadow-[0_0_20px_hsl(38_92%_50%/0.4)]';
      default: return 'border-border hover:border-primary/50';
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-sm font-bold text-foreground tracking-wide">ATTACK SIMULATION VISUALIZER</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={launchAttack}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm hover:bg-destructive/20 transition-colors border border-destructive/30"
          >
            <Zap className="h-4 w-4" />
            Launch Attack
          </button>
          <button
            onClick={() => setAutoMode(!autoMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border ${
              autoMode ? 'bg-success/10 text-success border-success/30' : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            <Activity className="h-4 w-4" />
            {autoMode ? 'Auto: ON' : 'Auto: OFF'}
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-52px)]">
        {/* Server Visualization */}
        <div className="flex-1 relative p-8">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {connections.map(([from, to]) => {
              const fromNode = nodes.find(n => n.id === from)!;
              const toNode = nodes.find(n => n.id === to)!;
              return (
                <line
                  key={`${from}-${to}`}
                  x1={`${fromNode.x}%`} y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`} y2={`${toNode.y}%`}
                  stroke="hsl(222, 30%, 18%)"
                  strokeWidth="0.3"
                  strokeDasharray="2,2"
                />
              );
            })}
          </svg>

          {/* Attack packets */}
          <AnimatePresence>
            {attackPackets.map(pkt => (
              <motion.div
                key={pkt.id}
                className="absolute w-3 h-3 rounded-full z-20"
                style={{ backgroundColor: pkt.color, boxShadow: `0 0 12px ${pkt.color}` }}
                initial={{ left: `${pkt.fromX}%`, top: `${pkt.fromY}%`, scale: 0 }}
                animate={{ left: `${pkt.toX}%`, top: `${pkt.toY}%`, scale: [0, 1.5, 1] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            ))}
          </AnimatePresence>

          {/* Server Nodes */}
          {nodes.map(node => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                animate={node.status === 'under-attack' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: node.status === 'under-attack' ? Infinity : 0 }}
              >
                <div className={`bg-card border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-300 ${getStatusBorder(node.status)}`}>
                  <Icon className={`h-8 w-8 ${getStatusColor(node.status)}`} />
                  <span className="text-xs font-medium text-foreground">{node.name}</span>
                  <span className={`text-[9px] font-mono uppercase tracking-wider ${
                    node.status === 'under-attack' ? 'text-destructive' : node.status === 'blocked' ? 'text-warning' : 'text-success'
                  }`}>
                    {node.status === 'under-attack' ? '⚠ UNDER ATTACK' : node.status === 'blocked' ? '🛡 BLOCKING' : '● ONLINE'}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Attacker indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="font-mono">EXTERNAL THREAT SOURCES</span>
          </div>
        </div>

        {/* Event Log */}
        <div className="w-96 border-l border-border bg-card/50 flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Event Log</h2>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-1.5">
            {log.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[10px] font-mono p-2 rounded ${
                  entry.includes('[ALERT]') ? 'bg-destructive/10 text-destructive' :
                  entry.includes('[BLOCKED]') ? 'bg-success/10 text-success' :
                  'bg-muted/30 text-muted-foreground'
                }`}
              >
                {entry}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackSimulation;
