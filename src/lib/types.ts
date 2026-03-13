export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ThreatAlert {
  id: string;
  type: string;
  sourceIp: string;
  sourceCountry: string;
  sourceCoords: [number, number]; // [lat, lng]
  severity: SeverityLevel;
  score: number; // 1-10
  timestamp: Date;
  blocked: boolean;
  description: string;
}

export interface BlockchainBlock {
  index: number;
  timestamp: Date;
  data: {
    attackType: string;
    sourceIp: string;
    severity: SeverityLevel;
    score: number;
  };
  hash: string;
  previousHash: string;
  nonce: number;
}

export interface NetworkTrafficPoint {
  time: string;
  incoming: number;
  outgoing: number;
  malicious: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
