import { useThreatContext } from '@/context/ThreatContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lock, Link } from 'lucide-react';

const BlockchainLedger = () => {
  const { blockchain } = useThreatContext();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-primary" /> Blockchain Security Ledger
        </h3>
        <span className="text-[10px] text-muted-foreground font-mono">{blockchain.length} BLOCKS</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {blockchain.slice(-15).reverse().map((block) => (
            <div key={block.index} className="bg-background/50 rounded-md p-3 border border-border/50 font-mono text-[10px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-primary font-semibold">Block #{block.index}</span>
                <span className="text-muted-foreground">{block.timestamp.toLocaleTimeString('en-US', { hour12: false })}</span>
              </div>
              <div className="space-y-0.5 text-muted-foreground">
                <p>Attack: <span className="text-foreground">{block.data.attackType}</span></p>
                <p>Source: <span className="text-foreground">{block.data.sourceIp}</span></p>
                <p>Severity: <span className={
                  block.data.severity === 'Critical' || block.data.severity === 'High' ? 'text-destructive' :
                  block.data.severity === 'Medium' ? 'text-warning' : 'text-success'
                }>{block.data.severity} ({block.data.score}/10)</span></p>
                <p className="pt-1 flex items-center gap-1">
                  <Link className="h-2.5 w-2.5 text-primary" />
                  <span className="text-primary/60 truncate">{block.hash.slice(0, 32)}...</span>
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-muted-foreground/50 truncate">prev: {block.previousHash.slice(0, 24)}...</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BlockchainLedger;
