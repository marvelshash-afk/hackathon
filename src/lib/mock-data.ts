import { ThreatAlert, BlockchainBlock, NetworkTrafficPoint, SeverityLevel } from './types';

const attackTypes = [
  'DDoS Attack', 'Brute Force Login', 'Port Scanning', 'SQL Injection',
  'Malware Traffic', 'Phishing Attempt', 'Man-in-the-Middle', 'Zero-Day Exploit',
  'Ransomware', 'DNS Spoofing', 'XSS Attack', 'Buffer Overflow'
];

const countries: Array<{ name: string; coords: [number, number] }> = [
  { name: 'Russia', coords: [55.75, 37.62] },
  { name: 'China', coords: [39.91, 116.40] },
  { name: 'North Korea', coords: [39.03, 125.75] },
  { name: 'Iran', coords: [35.69, 51.39] },
  { name: 'Brazil', coords: [-15.78, -47.93] },
  { name: 'Nigeria', coords: [9.06, 7.49] },
  { name: 'India', coords: [28.61, 77.21] },
  { name: 'Vietnam', coords: [21.03, 105.85] },
  { name: 'Romania', coords: [44.43, 26.10] },
  { name: 'Ukraine', coords: [50.45, 30.52] },
];

const severities: SeverityLevel[] = ['Low', 'Medium', 'High', 'Critical'];

function randomIp(): string {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0') + 
         Math.abs(hash * 31).toString(16).padStart(16, '0') +
         Math.abs(hash * 97).toString(16).padStart(16, '0') +
         Math.abs(hash * 127).toString(16).padStart(16, '0');
}

export function generateThreat(): ThreatAlert {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const scoreMap: Record<SeverityLevel, [number, number]> = {
    'Low': [1, 3], 'Medium': [4, 5], 'High': [6, 8], 'Critical': [9, 10]
  };
  const [min, max] = scoreMap[severity];
  const score = Math.floor(Math.random() * (max - min + 1)) + min;
  const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];

  return {
    id: crypto.randomUUID(),
    type,
    sourceIp: randomIp(),
    sourceCountry: country.name,
    sourceCoords: country.coords,
    severity,
    score,
    timestamp: new Date(),
    blocked: false,
    description: `Detected ${type.toLowerCase()} originating from ${country.name} (${randomIp()}). Threat level: ${severity}.`,
  };
}

export function generateInitialThreats(count: number): ThreatAlert[] {
  return Array.from({ length: count }, (_, i) => {
    const threat = generateThreat();
    threat.timestamp = new Date(Date.now() - (count - i) * 60000 * Math.random() * 30);
    threat.blocked = Math.random() > 0.6;
    return threat;
  });
}

export function threatToBlock(threat: ThreatAlert, previousHash: string, index: number): BlockchainBlock {
  const data = {
    attackType: threat.type,
    sourceIp: threat.sourceIp,
    severity: threat.severity,
    score: threat.score,
  };
  const blockStr = JSON.stringify({ index, data, previousHash, timestamp: threat.timestamp.toISOString() });
  return {
    index,
    timestamp: threat.timestamp,
    data,
    hash: simpleHash(blockStr),
    previousHash,
    nonce: Math.floor(Math.random() * 100000),
  };
}

export function generateTrafficData(points: number): NetworkTrafficPoint[] {
  const now = new Date();
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(now.getTime() - (points - i) * 5000);
    return {
      time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      incoming: Math.floor(Math.random() * 800 + 200),
      outgoing: Math.floor(Math.random() * 600 + 100),
      malicious: Math.floor(Math.random() * 80),
    };
  });
}

export function getRecommendations(threat: ThreatAlert): string[] {
  const base = [
    `Block IP address ${threat.sourceIp} at the firewall level`,
    `Add ${threat.sourceIp} to the global blocklist`,
  ];
  const typeSpecific: Record<string, string[]> = {
    'DDoS Attack': ['Enable rate limiting on all endpoints', 'Activate DDoS mitigation service', 'Scale up server capacity temporarily'],
    'Brute Force Login': ['Enable account lockout after 5 failed attempts', 'Enforce multi-factor authentication', 'Implement CAPTCHA on login forms'],
    'Port Scanning': ['Close unnecessary open ports', 'Enable port knocking', 'Review firewall rules for exposed services'],
    'SQL Injection': ['Sanitize all user inputs', 'Use parameterized queries', 'Deploy a Web Application Firewall (WAF)'],
    'Malware Traffic': ['Isolate affected systems immediately', 'Run full antivirus scan', 'Update all endpoint protection signatures'],
    'Phishing Attempt': ['Alert all users about the phishing campaign', 'Block the phishing domain', 'Review email filtering rules'],
    'Ransomware': ['Disconnect affected systems from network', 'Verify backup integrity', 'Do NOT pay the ransom'],
    'XSS Attack': ['Implement Content Security Policy headers', 'Sanitize all output rendering', 'Enable HttpOnly cookie flags'],
  };
  return [...base, ...(typeSpecific[threat.type] || ['Review and update security policies', 'Conduct a security audit'])];
}
