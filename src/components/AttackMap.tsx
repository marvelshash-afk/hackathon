import { useThreatContext } from '@/context/ThreatContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const AttackMap = () => {
  const { threats } = useThreatContext();
  const activeThreats = threats.filter(t => !t.blocked).slice(0, 15);

  // Simple SVG world map approximation with threat dots
  const mapToSvg = (lat: number, lng: number): [number, number] => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return [x, y];
  };

  // Target (US-based SOC)
  const target: [number, number] = mapToSvg(38.9, -77.04);

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <h3 className="text-sm font-semibold text-foreground mb-2">Global Attack Origin Map</h3>
      <div className="relative w-full aspect-[2/1] bg-background/50 rounded-md overflow-hidden bg-grid-pattern">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Simplified continent outlines */}
          <g opacity="0.15" stroke="hsl(187 94% 43%)" fill="none" strokeWidth="0.5">
            {/* North America */}
            <path d="M120,80 L180,60 L220,80 L240,120 L220,160 L200,180 L180,200 L140,180 L120,160 L100,140 L90,120 L100,100Z" />
            {/* South America */}
            <path d="M180,220 L220,210 L240,240 L250,280 L240,320 L220,350 L200,360 L180,340 L170,300 L175,260Z" />
            {/* Europe */}
            <path d="M380,80 L420,70 L440,80 L450,100 L440,120 L420,130 L400,120 L380,110Z" />
            {/* Africa */}
            <path d="M380,160 L420,150 L450,170 L460,220 L450,270 L430,300 L400,310 L380,290 L370,250 L375,200Z" />
            {/* Asia */}
            <path d="M460,60 L550,50 L620,70 L680,80 L700,100 L690,130 L660,150 L600,160 L540,150 L500,130 L470,110 L460,90Z" />
            {/* Australia */}
            <path d="M620,280 L680,270 L710,290 L700,320 L670,330 L640,320 L620,300Z" />
          </g>

          {/* Target node (SOC) */}
          <circle cx={target[0]} cy={target[1]} r="4" fill="hsl(187 94% 43%)" opacity="0.8" />
          <circle cx={target[0]} cy={target[1]} r="8" fill="none" stroke="hsl(187 94% 43%)" strokeWidth="1" opacity="0.4">
            <animate attributeName="r" from="8" to="16" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Attack lines and nodes */}
          {activeThreats.map((threat, i) => {
            const [sx, sy] = mapToSvg(threat.sourceCoords[0], threat.sourceCoords[1]);
            const color = threat.severity === 'Critical' || threat.severity === 'High' 
              ? 'hsl(0 84% 60%)' 
              : threat.severity === 'Medium' 
                ? 'hsl(38 92% 50%)' 
                : 'hsl(160 84% 39%)';
            return (
              <g key={threat.id}>
                {/* Attack line */}
                <line x1={sx} y1={sy} x2={target[0]} y2={target[1]} 
                  stroke={color} strokeWidth="1" opacity="0.4" strokeDasharray="4 4">
                  <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite" />
                </line>
                {/* Source node */}
                <circle cx={sx} cy={sy} r="3" fill={color} opacity="0.8" />
                <circle cx={sx} cy={sy} r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3">
                  <animate attributeName="r" from="6" to="12" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.3" to="0" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex gap-3">
          {[
            { color: 'bg-destructive', label: 'High/Critical' },
            { color: 'bg-warning', label: 'Medium' },
            { color: 'bg-success', label: 'Low' },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <span className={cn("w-1.5 h-1.5 rounded-full", l.color)} /> {l.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttackMap;
