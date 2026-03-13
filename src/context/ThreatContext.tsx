import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { ThreatAlert, BlockchainBlock, NetworkTrafficPoint, ChatMessage } from '@/lib/types';
import { generateThreat, generateInitialThreats, threatToBlock, generateTrafficData, getRecommendations } from '@/lib/mock-data';

interface ThreatContextType {
  threats: ThreatAlert[];
  blockchain: BlockchainBlock[];
  trafficData: NetworkTrafficPoint[];
  chatMessages: ChatMessage[];
  isSimulating: boolean;
  totalBlocked: number;
  activeThreats: number;
  threatScore: number;
  blockThreat: (id: string) => void;
  simulateAttack: () => void;
  toggleSimulation: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  getRecommendationsForThreat: (threat: ThreatAlert) => string[];
}

const ThreatContext = createContext<ThreatContextType | null>(null);

export const useThreatContext = () => {
  const ctx = useContext(ThreatContext);
  if (!ctx) throw new Error('useThreatContext must be used within ThreatProvider');
  return ctx;
};

export const ThreatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threats, setThreats] = useState<ThreatAlert[]>(() => generateInitialThreats(12));
  const [blockchain, setBlockchain] = useState<BlockchainBlock[]>([]);
  const [trafficData, setTrafficData] = useState<NetworkTrafficPoint[]>(() => generateTrafficData(30));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: '🛡️ **Null Breach AI Security Assistant Online**\n\nI\'m monitoring your network in real-time. I\'ll alert you when threats are detected and guide you through mitigation steps.\n\nCurrent status: **Systems Active** | Monitoring all endpoints.', timestamp: new Date() }
  ]);
  const [isSimulating, setIsSimulating] = useState(true);
  const simulationRef = useRef<ReturnType<typeof setInterval>>();
  const trafficRef = useRef<ReturnType<typeof setInterval>>();

  // Initialize blockchain from initial threats
  useEffect(() => {
    const blocks: BlockchainBlock[] = [];
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    threats.forEach((t, i) => {
      const block = threatToBlock(t, prevHash, i);
      blocks.push(block);
      prevHash = block.hash;
    });
    setBlockchain(blocks);
  }, []); // eslint-disable-line

  const addThreatToBlockchain = useCallback((threat: ThreatAlert) => {
    setBlockchain(prev => {
      const prevHash = prev.length > 0 ? prev[prev.length - 1].hash : '0'.repeat(64);
      return [...prev, threatToBlock(threat, prevHash, prev.length)];
    });
  }, []);

  const blockThreat = useCallback((id: string) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, blocked: true } : t));
  }, []);

  const simulateAttack = useCallback(() => {
    const threat = generateThreat();
    setThreats(prev => [threat, ...prev]);
    addThreatToBlockchain(threat);
    setChatMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `🚨 **THREAT DETECTED: ${threat.type}**\n\n**Source:** ${threat.sourceIp} (${threat.sourceCountry})\n**Severity:** ${threat.severity} (Score: ${threat.score}/10)\n**Time:** ${threat.timestamp.toLocaleTimeString()}\n\n${threat.description}\n\n**Recommended Actions:**\n${getRecommendations(threat).slice(0, 3).map(r => `• ${r}`).join('\n')}`,
      timestamp: new Date(),
    }]);
  }, [addThreatToBlockchain]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatMessages(prev => [...prev, msg]);
  }, []);

  const getRecommendationsForThreat = useCallback((threat: ThreatAlert) => {
    return getRecommendations(threat);
  }, []);

  // Auto-simulation
  useEffect(() => {
    if (isSimulating) {
      simulationRef.current = setInterval(() => {
        simulateAttack();
      }, 8000 + Math.random() * 12000);
    }
    return () => { if (simulationRef.current) clearInterval(simulationRef.current); };
  }, [isSimulating, simulateAttack]);

  // Traffic data updates
  useEffect(() => {
    trafficRef.current = setInterval(() => {
      setTrafficData(prev => {
        const now = new Date();
        const newPoint: NetworkTrafficPoint = {
          time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          incoming: Math.floor(Math.random() * 800 + 200),
          outgoing: Math.floor(Math.random() * 600 + 100),
          malicious: Math.floor(Math.random() * 80),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);
    return () => { if (trafficRef.current) clearInterval(trafficRef.current); };
  }, []);

  const totalBlocked = threats.filter(t => t.blocked).length;
  const activeThreats = threats.filter(t => !t.blocked).length;
  const recentThreats = threats.filter(t => !t.blocked && Date.now() - t.timestamp.getTime() < 3600000);
  const threatScore = recentThreats.length > 0 
    ? Math.min(10, Math.round(recentThreats.reduce((s, t) => s + t.score, 0) / recentThreats.length * 1.5))
    : 1;

  return (
    <ThreatContext.Provider value={{
      threats, blockchain, trafficData, chatMessages, isSimulating,
      totalBlocked, activeThreats, threatScore,
      blockThreat, simulateAttack, toggleSimulation, addChatMessage, getRecommendationsForThreat,
    }}>
      {children}
    </ThreatContext.Provider>
  );
};
