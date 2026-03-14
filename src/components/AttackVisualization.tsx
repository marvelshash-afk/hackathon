import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Box, Cylinder, Line, Text, Torus } from "@react-three/drei";
import * as THREE from "three";
import { AttackType } from "./RobotAssistant";

interface AttackVisualizationProps {
  attackType: AttackType;
}

// DDoS Attack: Swarm of nodes flooding server
const DDoSVisualization = () => {
  const serverRef = useRef<THREE.Mesh>(null);
  const attackerRefs = useRef<THREE.Mesh[]>([]);

  const attackers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 3.5;
      return {
        position: [Math.cos(angle) * radius, Math.sin(angle * 1.5) * 0.8, Math.sin(angle) * radius] as [number, number, number],
        delay: i * 0.1
      };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (serverRef.current) {
      serverRef.current.rotation.y = time * 0.3;
      serverRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#ef4444" />
      
      {/* Central Server */}
      <Sphere ref={serverRef} args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} metalness={0.8} />
      </Sphere>

      <Text position={[0, -1.5, 0]} fontSize={0.3} color="#ffffff">
        TARGET SERVER
      </Text>

      {/* Attacker Nodes */}
      {attackers.map((attacker, idx) => (
        <React.Fragment key={idx}>
          <AttackerNode position={attacker.position} index={idx} color="#ef4444" />
          <AttackParticles start={attacker.position} end={[0, 0, 0]} color="#ef4444" delay={attacker.delay} count={3} />
        </React.Fragment>
      ))}

      <Text position={[0, 3, 0]} fontSize={0.5} color="#ef4444" fontWeight="bold">
        DDoS ATTACK
      </Text>
    </>
  );
};

// SQL Injection: Database with malicious queries
const SQLInjectionVisualization = () => {
  const dbRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (dbRef.current) {
      dbRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const queries = useMemo(() => [
    { pos: [-2, 1, 0] as [number, number, number], text: "DROP TABLE" },
    { pos: [2, 0.5, 0] as [number, number, number], text: "' OR '1'='1" },
    { pos: [-1.5, -0.5, 1] as [number, number, number], text: "UNION SELECT" }
  ], []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#f97316" />

      {/* Database Cylinders */}
      <group ref={dbRef}>
        <Cylinder args={[0.6, 0.6, 1.5, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} metalness={0.9} />
        </Cylinder>
        <Cylinder args={[0.6, 0.6, 0.1, 32]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.8} />
        </Cylinder>
        <Cylinder args={[0.6, 0.6, 0.1, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.8} />
        </Cylinder>
        <Cylinder args={[0.6, 0.6, 0.1, 32]} position={[0, -0.8, 0]}>
          <meshStandardMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.8} />
        </Cylinder>
      </group>

      <Text position={[0, -2, 0]} fontSize={0.25} color="#ffffff">
        DATABASE
      </Text>

      {/* Malicious Query Strings */}
      {queries.map((query, idx) => (
        <InjectionQuery key={idx} position={query.pos} text={query.text} delay={idx * 0.5} />
      ))}

      <Text position={[0, 3, 0]} fontSize={0.5} color="#f97316" fontWeight="bold">
        SQL INJECTION
      </Text>
    </>
  );
};

// MITM: Two nodes with interceptor
const MITMVisualization = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 3, 0]} intensity={1.5} color="#eab308" />

      {/* User Computer */}
      <Box args={[0.8, 0.6, 0.1]} position={[-3, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.6} />
      </Box>
      <Text position={[-3, -1, 0]} fontSize={0.2} color="#ffffff">
        USER
      </Text>

      {/* Server */}
      <Box args={[0.8, 0.6, 0.1]} position={[3, 0, 0]}>
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.6} />
      </Box>
      <Text position={[3, -1, 0]} fontSize={0.2} color="#ffffff">
        SERVER
      </Text>

      {/* Attacker in Middle */}
      <AttackerSphere position={[0, 0, 0]} color="#eab308" />
      <Text position={[0, -1.2, 0]} fontSize={0.25} color="#eab308">
        ATTACKER
      </Text>

      {/* Intercepted Packets */}
      <InterceptedPackets />

      <Text position={[0, 3, 0]} fontSize={0.5} color="#eab308" fontWeight="bold">
        MAN-IN-THE-MIDDLE
      </Text>
    </>
  );
};

// Malware: Spreading infection
const MalwareVisualization = () => {
  const nodes = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 2.5;
      positions.push([
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.5,
        Math.sin(angle) * radius
      ]);
    }
    return positions;
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#a855f7" />

      {/* Network Nodes */}
      {nodes.map((pos, idx) => (
        <React.Fragment key={idx}>
          <InfectedNode position={pos} index={idx} />
          {idx < nodes.length - 1 && (
            <Line points={[pos, nodes[idx + 1]]} color="#a855f7" lineWidth={2} opacity={0.5} transparent />
          )}
        </React.Fragment>
      ))}

      {/* Virus Particles */}
      {nodes.map((pos, idx) => (
        <VirusParticle key={idx} position={pos} delay={idx * 0.2} />
      ))}

      <Text position={[0, 3, 0]} fontSize={0.5} color="#a855f7" fontWeight="bold">
        MALWARE INFECTION
      </Text>
    </>
  );
};

// Phishing: Fake login pages
const PhishingVisualization = () => {
  const emails = useMemo(() => [
    { pos: [-2, 1.5, 0] as [number, number, number], delay: 0 },
    { pos: [2, 1, 0] as [number, number, number], delay: 0.3 },
    { pos: [0, 0.5, 1.5] as [number, number, number], delay: 0.6 }
  ], []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 3, 0]} intensity={1.5} color="#ec4899" />

      {/* Target User */}
      <Sphere args={[0.5, 32, 32]} position={[0, -1.5, 0]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.6} />
      </Sphere>
      <Text position={[0, -2.5, 0]} fontSize={0.25} color="#ffffff">
        TARGET USER
      </Text>

      {/* Fake Email Nodes */}
      {emails.map((email, idx) => (
        <PhishingEmail key={idx} position={email.pos} delay={email.delay} />
      ))}

      {/* Fake Login Page */}
      <Box args={[1.5, 1, 0.05]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
      </Box>
      <Text position={[0, 0.5, 0.1]} fontSize={0.15} color="#ffffff">
        FAKE LOGIN
      </Text>

      <Text position={[0, 3, 0]} fontSize={0.5} color="#ec4899" fontWeight="bold">
        PHISHING ATTACK
      </Text>
    </>
  );
};

// Helper Components
const AttackerNode = ({ position, index, color }: { position: [number, number, number]; index: number; color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime + index;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3;
    }
  });
  return (
    <Sphere ref={ref} args={[0.25, 16, 16]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} wireframe />
    </Sphere>
  );
};

const AttackParticles = ({ start, end, color, delay, count }: { start: [number, number, number]; end: [number, number, number]; color: string; delay: number; count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <AttackParticle key={i} start={start} end={end} color={color} delay={delay + i * 0.3} />
      ))}
    </>
  );
};

const AttackParticle = ({ start, end, color, delay }: { start: [number, number, number]; end: [number, number, number]; color: string; delay: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const time = (state.clock.elapsedTime + delay) % 2;
      const t = time / 2;
      ref.current.position.x = start[0] + (end[0] - start[0]) * t;
      ref.current.position.y = start[1] + (end[1] - start[1]) * t;
      ref.current.position.z = start[2] + (end[2] - start[2]) * t;
      ref.current.scale.setScalar((1 - t) * 0.3);
    }
  });
  return (
    <Sphere ref={ref} args={[0.1, 8, 8]} position={start}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </Sphere>
  );
};

const InjectionQuery = ({ position, text, delay }: { position: [number, number, number]; text: string; delay: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const time = (state.clock.elapsedTime + delay) % 3;
      ref.current.position.x = position[0] + Math.sin(time) * 0.5;
      ref.current.position.y = position[1] - time * 0.5;
    }
  });
  return (
    <group ref={ref} position={position}>
      <Text fontSize={0.2} color="#f97316">
        {text}
      </Text>
    </group>
  );
};

const AttackerSphere = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime;
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
    }
  });
  return (
    <Sphere ref={ref} args={[0.6, 32, 32]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </Sphere>
  );
};

const InterceptedPackets = () => {
  return (
    <>
      <PacketFlow start={[-3, 0, 0]} end={[0, 0, 0]} color="#3b82f6" delay={0} />
      <PacketFlow start={[0, 0, 0]} end={[3, 0, 0]} color="#eab308" delay={0.5} />
    </>
  );
};

const PacketFlow = ({ start, end, color, delay }: { start: [number, number, number]; end: [number, number, number]; color: string; delay: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const time = (state.clock.elapsedTime + delay) % 2;
      const t = time / 2;
      ref.current.position.x = start[0] + (end[0] - start[0]) * t;
    }
  });
  return (
    <Box ref={ref} args={[0.2, 0.2, 0.2]} position={start}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </Box>
  );
};

const InfectedNode = ({ position, index }: { position: [number, number, number]; index: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const infectionProgress = (state.clock.elapsedTime - index * 0.3) % 3;
      const isInfected = infectionProgress > 0;
      ref.current.scale.setScalar(isInfected ? 1 + Math.sin(state.clock.elapsedTime * 5) * 0.2 : 1);
    }
  });
  return (
    <Sphere ref={ref} args={[0.3, 16, 16]} position={position}>
      <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} />
    </Sphere>
  );
};

const VirusParticle = ({ position, delay }: { position: [number, number, number]; delay: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay;
      ref.current.position.x = position[0] + Math.sin(time * 2) * 0.5;
      ref.current.position.y = position[1] + Math.cos(time * 2) * 0.5;
      ref.current.rotation.x = time * 3;
      ref.current.rotation.y = time * 2;
    }
  });
  return (
    <Box ref={ref} args={[0.1, 0.1, 0.1]} position={position}>
      <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
    </Box>
  );
};

const PhishingEmail = ({ position, delay }: { position: [number, number, number]; delay: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const time = (state.clock.elapsedTime + delay) % 3;
      ref.current.position.y = position[1] - time * 0.8;
      ref.current.rotation.y = time * 2;
    }
  });
  return (
    <group ref={ref} position={position}>
      <Box args={[0.6, 0.4, 0.05]}>
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
      </Box>
    </group>
  );
};

// Main Component
const AttackVisualization: React.FC<AttackVisualizationProps> = ({ attackType }) => {
  const renderVisualization = () => {
    switch (attackType) {
      case "ddos":
        return <DDoSVisualization />;
      case "sql_injection":
        return <SQLInjectionVisualization />;
      case "mitm":
        return <MITMVisualization />;
      case "malware":
        return <MalwareVisualization />;
      case "phishing":
        return <PhishingVisualization />;
      default:
        return <DDoSVisualization />;
    }
  };

  return (
    <div className="w-full h-full bg-slate-950">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        {renderVisualization()}
      </Canvas>
    </div>
  );
};

export default AttackVisualization;
