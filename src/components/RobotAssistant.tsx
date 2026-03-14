import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Box, Torus } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, AlertTriangle, Volume2, Info } from "lucide-react";

export type AttackType = "ddos" | "sql_injection" | "mitm" | "malware" | "phishing";
export type SeverityLevel = "low" | "medium" | "high" | "critical";

export interface Attack {
  type: AttackType;
  severity: SeverityLevel;
  sourceIp: string;
  targetIp: string;
  description: string;
}

interface RobotAssistantProps {
  currentAttack?: Attack | null;
  onAttackAcknowledged?: () => void;
}

const Robot = ({ attack, isTalking }: { attack?: Attack | null; isTalking: boolean }) => {
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const antennaLightRef = useRef<THREE.Mesh>(null);

  const getColor = () => {
    if (!attack) return "#3b82f6";
    switch (attack.severity) {
      case "critical": return "#ef4444";
      case "high": return "#f97316";
      case "medium": return "#eab308";
      case "low": return "#22c55e";
      default: return "#3b82f6";
    }
  };

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Head animation
    if (headRef.current) {
      headRef.current.position.y = Math.sin(time * 2) * 0.1;
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
    }
    
    // Body animation
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(time * 2) * 0.05 - 0.5;
    }
    
    // Eye blinking
    if (leftEyeRef.current && rightEyeRef.current) {
      const blink = Math.sin(time * 3) > 0.9 ? 0.1 : 1;
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;
    }
    
    // Talking animation
    if (mouthRef.current && isTalking) {
      mouthRef.current.scale.y = 0.5 + Math.sin(time * 20) * 0.3;
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = 0.3;
    }
    
    // Antenna light pulse
    if (antennaLightRef.current) {
      const intensity = attack ? 1 + Math.sin(time * 5) * 0.5 : 0.3;
      antennaLightRef.current.scale.setScalar(0.08 + Math.sin(time * 4) * 0.02);
    }
  });

  const color = getColor();

  return (
    <group>
      {/* Head */}
      <Sphere ref={headRef} args={[0.4, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={attack ? 0.8 : 0.3} 
          metalness={0.8} 
          roughness={0.2} 
        />
      </Sphere>

      {/* Eyes */}
      <Sphere ref={leftEyeRef} args={[0.08, 16, 16]} position={[-0.15, 0.1, 0.35]}>
        <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={1.5} />
      </Sphere>
      <Sphere ref={rightEyeRef} args={[0.08, 16, 16]} position={[0.15, 0.1, 0.35]}>
        <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={1.5} />
      </Sphere>

      {/* Mouth */}
      <Box ref={mouthRef} args={[0.2, 0.05, 0.05]} position={[0, -0.1, 0.38]}>
        <meshStandardMaterial color="#000000" />
      </Box>

      {/* Body */}
      <Box ref={bodyRef} args={[0.5, 0.6, 0.4]} position={[0, -0.5, 0]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={attack ? 0.5 : 0.2} 
          metalness={0.8} 
          roughness={0.2} 
        />
      </Box>

      {/* Chest Display */}
      <Box args={[0.25, 0.25, 0.05]} position={[0, -0.45, 0.23]}>
        <meshStandardMaterial color="#000000" emissive={color} emissiveIntensity={0.8} />
      </Box>

      {/* Antenna */}
      <Box args={[0.05, 0.3, 0.05]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </Box>
      <Sphere ref={antennaLightRef} args={[0.08, 16, 16]} position={[0, 0.7, 0]}>
        <meshStandardMaterial 
          color={attack ? "#ff0000" : "#00ff00"} 
          emissive={attack ? "#ff0000" : "#00ff00"} 
          emissiveIntensity={attack ? 2 : 0.5} 
        />
      </Sphere>

      {/* Arms */}
      <Box args={[0.15, 0.5, 0.15]} position={[-0.4, -0.4, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[0.15, 0.5, 0.15]} position={[0.4, -0.4, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Box>

      {/* Holographic ring when alert */}
      {attack && (
        <Torus args={[0.6, 0.02, 16, 100]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={1} 
            transparent 
            opacity={0.5} 
          />
        </Torus>
      )}

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} intensity={1} />
      <pointLight position={[-2, -2, -2]} intensity={0.5} color={color} />
      <spotLight position={[0, 3, 0]} angle={0.3} penumbra={1} intensity={attack ? 2 : 0.5} color={color} />
    </group>
  );
};

const RobotAssistant: React.FC<RobotAssistantProps> = ({ currentAttack, onAttackAcknowledged }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [speechBubble, setSpeechBubble] = useState("");
  const [hasSpoken, setHasSpoken] = useState(false);

  const attackInfo: Record<AttackType, { 
    name: string; 
    explanation: string; 
    voiceScript: string;
    mitigation: string[] 
  }> = {
    ddos: {
      name: "DDoS Attack",
      explanation: "A Distributed Denial of Service attack is flooding the server with massive traffic from multiple sources, overwhelming system resources and preventing legitimate users from accessing services.",
      voiceScript: "Warning! A Distributed Denial of Service attack has been detected. The server is being flooded with traffic from multiple sources. Recommended mitigation includes enabling rate limiting, activating CDN protection, and deploying DDoS mitigation services.",
      mitigation: [
        "Enable rate limiting on all endpoints",
        "Activate CDN and traffic filtering",
        "Deploy DDoS mitigation service",
        "Block malicious IP ranges",
        "Scale infrastructure resources"
      ]
    },
    sql_injection: {
      name: "SQL Injection Attack",
      explanation: "An attacker is attempting to inject malicious SQL code into database queries to gain unauthorized access to sensitive data or manipulate database operations.",
      voiceScript: "Alert! SQL Injection attack detected. An attacker is attempting to inject malicious code into database queries. Immediate action required. Use parameterized queries and validate all inputs.",
      mitigation: [
        "Use parameterized queries and prepared statements",
        "Validate and sanitize all user inputs",
        "Apply least privilege database permissions",
        "Enable Web Application Firewall rules",
        "Implement input validation on all forms"
      ]
    },
    mitm: {
      name: "Man-in-the-Middle Attack",
      explanation: "An attacker is intercepting communication between two parties, potentially reading or modifying data in transit without detection.",
      voiceScript: "Security breach detected! Man in the Middle attack in progress. Communication is being intercepted. Enforce HTTPS and TLS encryption immediately.",
      mitigation: [
        "Enforce HTTPS/TLS encryption",
        "Implement certificate pinning",
        "Use mutual authentication",
        "Monitor for suspicious certificates",
        "Deploy network intrusion detection"
      ]
    },
    malware: {
      name: "Malware Infection",
      explanation: "Malicious software has been detected attempting to compromise system integrity, steal data, or spread to other network resources.",
      voiceScript: "Critical alert! Malware infection detected. Malicious software is attempting to compromise the system. Isolate affected systems immediately and initiate security scan.",
      mitigation: [
        "Isolate infected systems from network",
        "Run comprehensive antivirus scan",
        "Update all security patches",
        "Review and analyze access logs",
        "Restore from clean backup if needed"
      ]
    },
    phishing: {
      name: "Phishing Attack",
      explanation: "A social engineering attack is attempting to trick users into revealing sensitive information through fake login pages or deceptive emails.",
      voiceScript: "Phishing attempt detected! A social engineering attack is targeting users with fake login pages. Block the sender domain and alert all users immediately.",
      mitigation: [
        "Block sender domain and IP address",
        "Alert users about phishing attempt",
        "Enable advanced email filtering",
        "Implement multi-factor authentication",
        "Conduct security awareness training"
      ]
    }
  };

  useEffect(() => {
    if (currentAttack && !hasSpoken) {
      setShowPanel(true);
      setHasSpoken(true);

      const info = attackInfo[currentAttack.type];
      setSpeechBubble(info.voiceScript);

      // Speech synthesis
      if ('speechSynthesis' in window) {
        setIsTalking(true);
        const utterance = new SpeechSynthesisUtterance(info.voiceScript);
        utterance.rate = 0.95;
        utterance.pitch = 1.1;
        utterance.volume = 0.9;
        
        utterance.onend = () => {
          setIsTalking(false);
          setTimeout(() => setSpeechBubble(""), 3000);
        };
        
        window.speechSynthesis.speak(utterance);
      }
    }

    if (!currentAttack) {
      setHasSpoken(false);
      setShowPanel(false);
      setSpeechBubble("");
      setIsTalking(false);
    }
  }, [currentAttack, hasSpoken]);

  const handleClose = () => {
    setShowPanel(false);
    setSpeechBubble("");
    if (onAttackAcknowledged) {
      onAttackAcknowledged();
    }
  };

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <>
      {/* Floating Robot Widget */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        {/* Speech Bubble */}
        <AnimatePresence>
          {speechBubble && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-28 right-0 w-80 bg-slate-900/95 backdrop-blur-lg border-2 border-blue-400 rounded-2xl p-4 shadow-2xl"
              style={{
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)"
              }}
            >
              <div className="flex items-start gap-2">
                <Volume2 className="w-5 h-5 text-blue-400 animate-pulse flex-shrink-0 mt-1" />
                <p className="text-white text-sm leading-relaxed">{speechBubble}</p>
              </div>
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-900 border-r-2 border-b-2 border-blue-400 transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Robot Container */}
        <div
          className="relative w-28 h-28 rounded-full overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 hover:scale-110"
          style={{
            background: currentAttack
              ? "radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(0,0,0,0.9) 100%)"
              : "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0.9) 100%)",
            border: currentAttack ? "3px solid #ef4444" : "3px solid #3b82f6",
            boxShadow: currentAttack
              ? "0 0 40px rgba(239,68,68,0.8), 0 0 80px rgba(239,68,68,0.4)"
              : "0 0 30px rgba(59,130,246,0.6)"
          }}
          onClick={togglePanel}
        >
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            <Robot attack={currentAttack} isTalking={isTalking} />
          </Canvas>
        </div>

        {/* Alert Badge */}
        {currentAttack && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
            style={{ boxShadow: "0 0 20px rgba(239, 68, 68, 0.8)" }}
          >
            <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
          </motion.div>
        )}

        {/* Info Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePanel}
          className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
        >
          <Info className="w-4 h-4 text-white" />
        </motion.button>
      </motion.div>

      {/* Holographic Info Panel */}
      <AnimatePresence>
        {showPanel && currentAttack && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-36 right-6 w-[420px] bg-slate-900/98 backdrop-blur-xl border-2 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              borderColor: currentAttack.severity === "critical" ? "#ef4444" : 
                          currentAttack.severity === "high" ? "#f97316" : 
                          currentAttack.severity === "medium" ? "#eab308" : "#22c55e",
              boxShadow: `0 0 50px ${
                currentAttack.severity === "critical" ? "rgba(239,68,68,0.5)" : 
                currentAttack.severity === "high" ? "rgba(249,115,22,0.5)" : 
                "rgba(234,179,8,0.5)"
              }`
            }}
          >
            {/* Header */}
            <div 
              className="p-5 flex items-center justify-between"
              style={{
                background: currentAttack.severity === "critical" 
                  ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  : currentAttack.severity === "high"
                  ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                  : "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)"
              }}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-7 h-7 text-white" />
                <div>
                  <h3 className="text-white font-bold text-xl">{attackInfo[currentAttack.type].name}</h3>
                  <p className="text-white/90 text-xs uppercase tracking-wider font-semibold">
                    Severity: {currentAttack.severity}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleClose} 
                className="text-white hover:bg-white/20 rounded-lg p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
              {/* Explanation */}
              <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
                <h4 className="text-blue-400 font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Attack Analysis
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {attackInfo[currentAttack.type].explanation}
                </p>
              </div>

              {/* Attack Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Source IP</span>
                  <p className="text-red-400 font-mono font-semibold mt-1">{currentAttack.sourceIp}</p>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">Target IP</span>
                  <p className="text-blue-400 font-mono font-semibold mt-1">{currentAttack.targetIp}</p>
                </div>
              </div>

              {/* Mitigation Steps */}
              <div>
                <h4 className="text-green-400 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Recommended Mitigation Steps
                </h4>
                <ul className="space-y-2">
                  {attackInfo[currentAttack.type].mitigation.map((step, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 text-sm bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 hover:border-green-500/50 transition"
                    >
                      <span className="text-green-400 font-bold text-lg leading-none">{idx + 1}</span>
                      <span className="text-gray-300 leading-relaxed">{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Acknowledge & Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RobotAssistant;
