// src/components/AttackMonitor.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useAttackDetection } from '@/hooks/useAttackDetection';
import { AttackAlert } from '@/service/notificationService';
import { Shield, AlertTriangle, AlertCircle, Info, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface AttackLog extends AttackAlert {
  notified: boolean;
}

export const AttackMonitor: React.FC = () => {
  const [attacks, setAttacks] = useState<AttackLog[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { detectAttack, detectSQLInjection, detectXSS } = useAttackDetection();
  const requestLog = useRef<Map<string, number[]>>(new Map());

  useEffect(() => {
    if (!isMonitoring) return;

    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      const endpoint = url.toString();
      
      // Log request for DDoS detection
      const ip = 'client'; // In real scenario, this comes from server
      const now = Date.now();
      const requests = requestLog.current.get(ip) || [];
      requests.push(now);
      // Keep only last minute
      const recent = requests.filter(t => now - t < 60000);
      requestLog.current.set(ip, recent);
      
      // Check for attacks in request
      if (options?.body) {
        const body = options.body.toString();
        detectSQLInjection(body, endpoint);
        detectXSS(body, endpoint);
      }

      if (options?.headers) {
        const headers = JSON.stringify(options.headers);
        detectSQLInjection(headers, endpoint);
      }

      return originalFetch(...args);
    };

    // Monitor form inputs
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value) {
        detectSQLInjection(target.value, window.location.pathname);
        detectXSS(target.value, window.location.pathname);
      }
    };

    document.addEventListener('input', handleInput);

    return () => {
      window.fetch = originalFetch;
      document.removeEventListener('input', handleInput);
    };
  }, [isMonitoring, detectSQLInjection, detectXSS]);

  const simulateAttack = async (type: 'sql' | 'xss' | 'brute' | 'ddos') => {

  const simulations = {
    sql: () => detectAttack({
      type: 'SQL Injection Attempt',
      severity: 'critical',
      metadata: {
        input: "' OR '1'='1",
        endpoint: '/api/users',
        description: 'Classic SQL injection pattern detected'
      }
    }),

    xss: () => detectAttack({
      type: 'XSS Attack Attempt',
      severity: 'high',
      metadata: {
        input: '<script>alert("xss")</script>',
        endpoint: '/search',
        description: 'Script tag injection attempt'
      }
    }),

    brute: () => detectAttack({
      type: 'Brute Force Attack',
      severity: 'high',
      metadata: {
        ip: '192.168.1.100',
        failedAttempts: 15,
        targetAccount: 'admin'
      }
    }),

    ddos: () => detectAttack({
      type: 'Potential DDoS Attack',
      severity: 'critical',
      metadata: {
        ip: '10.0.0.50',
        requestCount: 1000
      }
    })
  };

  // Trigger detection
  simulations[type]();

  // Send attack to honeypot
  await fetch("http://localhost:5001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      attack: type,
      ip: "192.168.1.100",
      endpoint: "/api/login"
    })
  });

  // Add attack to dashboard log
  const mockAlert: AttackLog = {
    id: `sim_${Date.now()}`,
    attackType: type === 'sql'
      ? 'SQL Injection'
      : type === 'xss'
      ? 'XSS'
      : type === 'brute'
      ? 'Brute Force'
      : 'DDoS',

    severity: type === 'sql' || type === 'ddos'
      ? 'critical'
      : 'high',

    timestamp: new Date().toISOString(),
    sourceIP: '192.168.1.100',
    targetEndpoint: '/api/endpoint',
    details: { simulated: true },
    notified: notificationsEnabled
  };

  setAttacks(prev => [mockAlert, ...prev].slice(0, 50));

};

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <Shield className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <CardTitle>Attack Monitor & Notifications</CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time attack detection with Email & SMS alerts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
              <span className="text-sm">
                {notificationsEnabled ? (
                  <Bell className="w-4 h-4 inline mr-1" />
                ) : (
                  <BellOff className="w-4 h-4 inline mr-1" />
                )}
                Alerts
              </span>
            </div>
            <Button
              variant={isMonitoring ? "destructive" : "default"}
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Simulation Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" onClick={() => simulateAttack('sql')} className="border-red-200 hover:bg-red-50">
            Simulate SQLi
          </Button>
          <Button variant="outline" onClick={() => simulateAttack('xss')} className="border-orange-200 hover:bg-orange-50">
            Simulate XSS
          </Button>
          <Button variant="outline" onClick={() => simulateAttack('brute')} className="border-yellow-200 hover:bg-yellow-50">
            Simulate Brute Force
          </Button>
          <Button variant="outline" onClick={() => simulateAttack('ddos')} className="border-red-200 hover:bg-red-50">
            Simulate DDoS
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {attacks.filter(a => a.severity === 'critical').length}
            </div>
            <div className="text-xs text-red-600">Critical</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {attacks.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-xs text-orange-600">High</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {attacks.filter(a => a.severity === 'medium').length}
            </div>
            <div className="text-xs text-yellow-600">Medium</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{attacks.length}</div>
            <div className="text-xs text-blue-600">Total</div>
          </div>
        </div>

        {/* Attack Log */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 font-medium text-sm">Recent Attacks</div>
          <div className="max-h-96 overflow-y-auto">
            {attacks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No attacks detected. Click simulate buttons to test notifications.
              </div>
            ) : (
              <div className="divide-y">
                {attacks.map((attack) => (
                  <div key={attack.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(attack.severity)}
                        <div>
                          <div className="font-medium">{attack.attackType}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {attack.sourceIP} → {attack.targetEndpoint}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(attack.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getSeverityColor(attack.severity)}>
                          {attack.severity}
                        </Badge>
                        {attack.notified && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Notified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttackMonitor;