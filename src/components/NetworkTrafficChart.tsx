import { useThreatContext } from '@/context/ThreatContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NetworkTrafficChart = () => {
  const { trafficData } = useThreatContext();

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full">
      <h3 className="text-sm font-semibold text-foreground mb-3">Network Traffic (Live)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={trafficData}>
          <defs>
            <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(187 94% 43%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(187 94% 43%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMalicious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(218 11% 65%)' }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(218 11% 65%)' }} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)', borderRadius: '8px', fontSize: '12px', color: 'hsl(210 20% 98%)' }}
          />
          <Area type="monotone" dataKey="incoming" stroke="hsl(187 94% 43%)" fill="url(#colorIncoming)" strokeWidth={2} />
          <Area type="monotone" dataKey="outgoing" stroke="hsl(218 11% 65%)" fill="transparent" strokeWidth={1} strokeDasharray="4 4" />
          <Area type="monotone" dataKey="malicious" stroke="hsl(0 84% 60%)" fill="url(#colorMalicious)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary" /> Incoming
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-muted-foreground" /> Outgoing
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-destructive" /> Malicious
        </span>
      </div>
    </div>
  );
};

export default NetworkTrafficChart;
