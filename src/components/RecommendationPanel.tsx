import { useThreatContext } from '@/context/ThreatContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Lightbulb } from 'lucide-react';

const RecommendationPanel = () => {
  const { threats, getRecommendationsForThreat } = useThreatContext();
  const latestUnblocked = threats.filter(t => !t.blocked).slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="h-3.5 w-3.5 text-warning" /> Security Recommendations
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {latestUnblocked.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-sm text-success font-semibold">All Clear</p>
              <p className="text-xs text-muted-foreground">No active threats require attention</p>
            </div>
          )}
          {latestUnblocked.map(threat => (
            <div key={threat.id} className="bg-background/50 rounded-md p-3 border border-border/50">
              <p className="text-xs font-semibold text-foreground mb-2">{threat.type} — {threat.sourceCountry}</p>
              <ul className="space-y-1.5">
                {getRecommendationsForThreat(threat).map((rec, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">›</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecommendationPanel;
