import React, { useState } from "react";
import RobotAssistant, { Attack, AttackType, SeverityLevel } from "../components/RobotAssistant";
import AttackVisualization from "../components/AttackVisualization";
import { motion } from "framer-motion";
import { Shield, Zap, AlertTriangle, Activity, Database, Network, Bug, Mail, Eye, Info } from "lucide-react";

const SOCDashboard: React.FC = () => {
  const [currentAttack, setCurrentAttack] = useState<Attack | null>(null);

  const attackTypes = [
    { 
      type: "ddos" as AttackType, 
      name: "DDoS", 
      severity: "critical" as SeverityLevel,
      icon: Activity,
      color: "from-red-600 to-red-700"
    },
    { 
      type: "sql_injection" as AttackType, 
      name: "SQL Injection", 
      severity: "high" as SeverityLevel,
      icon: Database,
      color: "from-orange-600 to-orange-700"
    },
    { 
      type: "mitm" as AttackType, 
      name: "MITM", 
      severity: "high" as SeverityLevel,
      icon: Network,
      color: "from-yellow-600 to-yellow-700"
    },
    { 
      type: "malware" as AttackType, 
      name: "Malware", 
      severity: "critical" as SeverityLevel,
      icon: Bug,
      color: "from-purple-600 to-purple-700"
    },
    { 
      type: "phishing" as AttackType, 
      name: "Phishing", 
      severity: "medium" as SeverityLevel,
      icon: Mail,
      color: "from-pink-600 to-pink-700"
    }
  ];

  const simulateAttack = (type: AttackType, severity: SeverityLevel, name: string) => {
    const sourceIps = ["192.168.1.100", "10.0.0.50", "172.16.0.25", "203.0.113.45", "198.51.100.78"];
    const targetIps = ["10.0.0.1", "192.168.1.1", "172.16.0.1"];

    const attack: Attack = {
      type,
      severity,
      sourceIp: sourceIps[Math.floor(Math.random() * sourceIps.length)],
      targetIp: targetIps[Math.floor(Math.random() * targetIps.length)],
      description: `${name} detected from external source`
    };

    setCurrentAttack(attack);
  };

  const clearAttack = () => {
    setCurrentAttack(null);
  };

  const handleAttackAcknowledged = () => {
    setCurrentAttack(null);
  };

  const attackInfo: Record<AttackType, { 
    name: string; 
    explanation: string; 
    mitigation: string[] 
  }> = {
    ddos: {
      name: "DDoS Attack",
      explanation: "Distributed Denial of Service attack flooding the server with massive traffic",
      mitigation: ["Enable rate limiting", "Activate CDN protection", "Deploy DDoS mitigation", "Block malicious IPs", "Scale infrastructure"]
    },
    sql_injection: {
      name: "SQL Injection",
      explanation: "Attacker injecting malicious SQL code into database queries",
      mitigation: ["Use parameterized queries", "Validate all inputs", "Apply least privilege", "Enable WAF rules", "Implement input validation"]
    },
    mitm: {
      name: "Man-in-the-Middle",
      explanation: "Attacker intercepting communication between two parties",
      mitigation: ["Enforce HTTPS/TLS", "Use certificate pinning", "Implement mutual auth", "Monitor certificates", "Deploy network IDS"]
    },
    malware: {
      name: "Malware Infection",
      explanation: "Malicious software attempting to compromise system integrity",
      mitigation: ["Isolate infected systems", "Run antivirus scan", "Update security patches", "Review access logs", "Restore from backup"]
    },
    phishing: {
      name: "Phishing Attack",
      explanation: "Social engineering attack attempting to steal credentials",
      mitigation: ["Block sender domain", "Alert users", "Enable email filtering", "Implement 2FA", "Conduct training"]
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Guardian AI - Security Operations Center
            </h1>
            <p className="text-xs text-gray-400">Real-time threat monitoring and analysis</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid Layout */}
      <div className="relative z-10 h-[calc(100vh-80px)] grid grid-cols-12 gap-4 p-4">
        
        {/* LEFT COLUMN - Attack Simulator (20%) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 overflow-y-auto"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Attack Simulator</h3>
              <p className="text-xs text-gray-500">Test scenarios</p>
            </div>
          </div>

          {/* Compact Attack Buttons */}
          <div className="space-y-2">
            {attackTypes.map((attack) => {
              const Icon = attack.icon;
              return (
                <motion.button
                  key={attack.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => simulateAttack(attack.type, attack.severity, attack.name)}
                  className={`w-full bg-gradient-to-r ${attack.color} text-white font-semibold py-2 px-3 rounded-lg transition-all flex items-center gap-2 text-sm`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{attack.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Clear Button */}
          {currentAttack && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearAttack}
              className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
            >
              Clear Attack
            </motion.button>
          )}

          {/* Active Attack Status */}
          {currentAttack && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-red-400 font-bold text-xs uppercase">Active</span>
              </div>
              <div className="text-xs text-gray-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-semibold">{currentAttack.type.replace("_", " ").toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Severity:</span>
                  <span className={`font-bold uppercase ${
                    currentAttack.severity === "critical" ? "text-red-400" :
                    currentAttack.severity === "high" ? "text-orange-400" :
                    "text-yellow-400"
                  }`}>
                    {currentAttack.severity}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* CENTER COLUMN - Attack Visualization (60%) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-7 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">3D Attack Visualization</h3>
              <p className="text-xs text-gray-500">Real-time threat simulation</p>
            </div>
            {currentAttack && (
              <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                <span className="text-xs font-bold text-red-400 uppercase">{currentAttack.type.replace("_", " ")}</span>
              </div>
            )}
          </div>

          {/* Visualization Container - Fixed Height */}
          <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden h-[350px]">
            {currentAttack ? (
              <AttackVisualization attackType={currentAttack.type} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No active attack</p>
                  <p className="text-gray-600 text-xs mt-1">Select an attack type to visualize</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Attack Analysis (20%) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-3 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 overflow-y-auto"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Attack Analysis</h3>
              <p className="text-xs text-gray-500">Threat details</p>
            </div>
          </div>

          {currentAttack ? (
            <div className="space-y-4">
              {/* Attack Info */}
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">Attack Type</h4>
                <p className="text-sm font-bold text-white mb-1">{attackInfo[currentAttack.type].name}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{attackInfo[currentAttack.type].explanation}</p>
              </div>

              {/* IP Details */}
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Source IP</span>
                  <p className="text-sm text-red-400 font-mono font-semibold mt-1">{currentAttack.sourceIp}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Target IP</span>
                  <p className="text-sm text-blue-400 font-mono font-semibold mt-1">{currentAttack.targetIp}</p>
                </div>
              </div>

              {/* Severity */}
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Severity Level</span>
                <p className={`text-lg font-bold mt-1 uppercase ${
                  currentAttack.severity === "critical" ? "text-red-400" :
                  currentAttack.severity === "high" ? "text-orange-400" :
                  currentAttack.severity === "medium" ? "text-yellow-400" :
                  "text-green-400"
                }`}>
                  {currentAttack.severity}
                </p>
              </div>

              {/* Mitigation Steps */}
              <div>
                <h4 className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Mitigation Steps
                </h4>
                <ul className="space-y-2">
                  {attackInfo[currentAttack.type].mitigation.map((step, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2 text-xs bg-slate-800/40 p-2 rounded border border-slate-700/50"
                    >
                      <span className="text-green-400 font-bold text-sm">{idx + 1}</span>
                      <span className="text-gray-300 leading-relaxed">{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Info className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No attack selected</p>
                <p className="text-gray-600 text-xs mt-1">Analysis will appear here</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Robot Assistant Widget */}
      <RobotAssistant 
        currentAttack={currentAttack} 
        onAttackAcknowledged={handleAttackAcknowledged} 
      />
    </div>
  );
};

export default SOCDashboard;
