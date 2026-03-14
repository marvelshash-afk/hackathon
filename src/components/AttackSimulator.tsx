import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, AlertTriangle, Activity, Database, Network, Bug, Mail } from "lucide-react";
import { AttackType, SeverityLevel } from "./RobotAssistant";

interface AttackSimulatorProps {
  onSimulateAttack: (type: AttackType, severity: SeverityLevel, name: string) => void;
  currentAttack: any;
  onClearAttack: () => void;
}

const AttackSimulator: React.FC<AttackSimulatorProps> = ({ 
  onSimulateAttack, 
  currentAttack, 
  onClearAttack 
}) => {
  const attackTypes = [
    { 
      type: "ddos" as AttackType, 
      name: "DDoS Attack", 
      severity: "critical" as SeverityLevel,
      icon: Activity,
      description: "Flood server with traffic",
      color: "from-red-600 to-red-700"
    },
    { 
      type: "sql_injection" as AttackType, 
      name: "SQL Injection", 
      severity: "high" as SeverityLevel,
      icon: Database,
      description: "Inject malicious SQL code",
      color: "from-orange-600 to-orange-700"
    },
    { 
      type: "mitm" as AttackType, 
      name: "Man-in-the-Middle", 
      severity: "high" as SeverityLevel,
      icon: Network,
      description: "Intercept communications",
      color: "from-yellow-600 to-yellow-700"
    },
    { 
      type: "malware" as AttackType, 
      name: "Malware", 
      severity: "critical" as SeverityLevel,
      icon: Bug,
      description: "Spread malicious software",
      color: "from-purple-600 to-purple-700"
    },
    { 
      type: "phishing" as AttackType, 
      name: "Phishing", 
      severity: "medium" as SeverityLevel,
      icon: Mail,
      description: "Social engineering attack",
      color: "from-pink-600 to-pink-700"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-4 z-30 bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700 rounded-xl p-5 shadow-2xl max-w-md"
      style={{ boxShadow: "0 0 40px rgba(0, 0, 0, 0.5)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Cyber Attack Simulator</h3>
          <p className="text-gray-400 text-xs">Test security response systems</p>
        </div>
      </div>

      {/* Attack Buttons */}
      <div className="space-y-2 mb-4">
        {attackTypes.map((attack) => {
          const Icon = attack.icon;
          return (
            <motion.button
              key={attack.type}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSimulateAttack(attack.type, attack.severity, attack.name)}
              className={`w-full bg-gradient-to-r ${attack.color} hover:shadow-lg text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-3 group`}
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-sm">{attack.name}</div>
                <div className="text-xs text-white/80">{attack.description}</div>
              </div>
              <Zap className="w-4 h-4 opacity-70 group-hover:opacity-100 transition" />
            </motion.button>
          );
        })}
      </div>

      {/* Clear Button */}
      {currentAttack && (
        <motion.button
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onClick={onClearAttack}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Clear Active Attack
        </motion.button>
      )}

      {/* Active Attack Status */}
      {currentAttack && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-4 bg-red-900/30 border-2 border-red-700 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Active Attack</span>
          </div>
          <div className="text-sm text-gray-300 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Type:</span>
              <span className="font-semibold text-white">{currentAttack.type.replace("_", " ").toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Severity:</span>
              <span className={`font-bold uppercase ${
                currentAttack.severity === "critical" ? "text-red-400" :
                currentAttack.severity === "high" ? "text-orange-400" :
                currentAttack.severity === "medium" ? "text-yellow-400" :
                "text-green-400"
              }`}>
                {currentAttack.severity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Source:</span>
              <span className="font-mono text-xs text-red-400">{currentAttack.sourceIp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target:</span>
              <span className="font-mono text-xs text-blue-400">{currentAttack.targetIp}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-gray-500 text-xs text-center">
          🤖 AI Robot Assistant will explain each attack
        </p>
      </div>
    </motion.div>
  );
};

export default AttackSimulator;
