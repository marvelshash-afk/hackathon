import React, { useEffect, useState, useRef } from "react"
import { useAttackDetection } from "@/hooks/useAttackDetection"
import { AttackAlert } from "@/services/notificationService"

import {
  Shield,
  AlertTriangle,
  AlertCircle,
  Info,
  Bell,
  BellOff
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface AttackLog extends AttackAlert {
  notified: boolean
}

export const AttackMonitor: React.FC = () => {

  const [attacks, setAttacks] = useState<AttackLog[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isMonitoring, setIsMonitoring] = useState(false)

  const { detectAttack, detectSQLInjection, detectXSS } = useAttackDetection()

  const requestLog = useRef<Map<string, number[]>>(new Map())

  /* ---------------- MONITOR INPUTS ---------------- */

  useEffect(() => {

    if (!isMonitoring) return

    const originalFetch = window.fetch

    window.fetch = async (...args) => {

      const [url, options] = args
      const endpoint = url.toString()

      const ip = "client"
      const now = Date.now()

      const requests = requestLog.current.get(ip) || []
      requests.push(now)

      const recent = requests.filter(t => now - t < 60000)

      requestLog.current.set(ip, recent)

      if (options?.body) {

        const body = options.body.toString()

        detectSQLInjection(body, endpoint)
        detectXSS(body, endpoint)

      }

      return originalFetch(...args)

    }

    const handleInput = (e: Event) => {

      const target = e.target as HTMLInputElement

      if (target.value) {

        detectSQLInjection(target.value, window.location.pathname)
        detectXSS(target.value, window.location.pathname)

      }

    }

    document.addEventListener("input", handleInput)

    return () => {

      window.fetch = originalFetch
      document.removeEventListener("input", handleInput)

    }

  }, [isMonitoring, detectSQLInjection, detectXSS])

  /* ---------------- ATTACK SIMULATION ---------------- */

  const simulateAttack = async (type: "sql" | "xss" | "brute" | "ddos") => {

    /* ----- Generate fake NSL-KDD features ----- */

    let features = Array(41).fill(0)

    if (type === "sql") features[5] = 1
    if (type === "xss") features[10] = 1
    if (type === "brute") features[15] = 1
    if (type === "ddos") features[20] = 1

    /* ----- ML Prediction ----- */

    let mlPrediction = "Unknown"

    try {

      const res = await fetch("http://localhost:5002/predict", {

        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ features })

      })

      const data = await res.json()

      mlPrediction = data.prediction

    } catch {

      console.log("ML API not running")

    }

    /* ----- Detection Trigger ----- */

    detectAttack({

      type: `${type.toUpperCase()} Attack`,
      severity: type === "sql" || type === "ddos" ? "critical" : "high",

      metadata: {

        endpoint: "/api/test",
        prediction: mlPrediction

      }

    })

    /* ----- Send to Honeypot ----- */

    try {

      await fetch("http://localhost:5001/login", {

        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          attack: type,
          ip: "192.168.1.100",
          endpoint: "/api/login",
          prediction: mlPrediction

        })

      })

    } catch {

      console.log("Honeypot not running")

    }

    /* ----- Add to Dashboard ----- */

    const newAttack: AttackLog = {

      id: `sim_${Date.now()}`,

      attackType: `${type.toUpperCase()} (ML:${mlPrediction})`,

      severity: type === "sql" || type === "ddos"
        ? "critical"
        : "high",

      timestamp: new Date().toISOString(),

      sourceIP: "192.168.1.100",

      targetEndpoint: "/api/test",

      details: { simulated: true, mlPrediction },

      notified: notificationsEnabled

    }

    setAttacks(prev => [newAttack, ...prev].slice(0, 50))

  }

  /* ---------------- UI HELPERS ---------------- */

  const getSeverityIcon = (severity: string) => {

    switch (severity) {

      case "critical":
        return <Shield className="w-5 h-5 text-red-600" />

      case "high":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />

      case "medium":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />

      default:
        return <Info className="w-5 h-5 text-blue-500" />

    }

  }

  const getSeverityColor = (severity: string) => {

    switch (severity) {

      case "critical":
        return "bg-red-100 text-red-800 border-red-200"

      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"

      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"

      default:
        return "bg-blue-100 text-blue-800 border-blue-200"

    }

  }

  /* ---------------- UI ---------------- */

  return (

    <Card className="w-full max-w-4xl">

      <CardHeader>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Shield className="w-8 h-8 text-primary" />

            <div>

              <CardTitle>Attack Monitor & AI Detection</CardTitle>

              <p className="text-sm text-muted-foreground">
                Real-time attack detection using ML + Honeypot
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

                {notificationsEnabled
                  ? <Bell className="w-4 h-4 inline mr-1" />
                  : <BellOff className="w-4 h-4 inline mr-1" />}

                Alerts

              </span>

            </div>

            <Button
              variant={isMonitoring ? "destructive" : "default"}
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>

          </div>

        </div>

      </CardHeader>

      <CardContent className="space-y-6">

        {/* Simulation Buttons */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <Button onClick={() => simulateAttack("sql")}>
            Simulate SQLi
          </Button>

          <Button onClick={() => simulateAttack("xss")}>
            Simulate XSS
          </Button>

          <Button onClick={() => simulateAttack("brute")}>
            Simulate Brute Force
          </Button>

          <Button onClick={() => simulateAttack("ddos")}>
            Simulate DDoS
          </Button>

        </div>

        {/* Attack Logs */}

        <div className="border rounded-lg overflow-hidden">

          <div className="bg-muted px-4 py-2 font-medium text-sm">
            Recent Attacks
          </div>

          <div className="max-h-96 overflow-y-auto">

            {attacks.length === 0 ? (

              <div className="p-8 text-center text-muted-foreground">
                No attacks detected.
              </div>

            ) : (

              <div className="divide-y">

                {attacks.map((attack) => (

                  <div key={attack.id} className="p-4">

                    <div className="flex items-start justify-between">

                      <div className="flex items-start gap-3">

                        {getSeverityIcon(attack.severity)}

                        <div>

                          <div className="font-medium">
                            {attack.attackType}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            {attack.sourceIP} → {attack.targetEndpoint}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {new Date(attack.timestamp).toLocaleString()}
                          </div>

                        </div>

                      </div>

                      <Badge className={getSeverityColor(attack.severity)}>
                        {attack.severity}
                      </Badge>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </CardContent>

    </Card>

  )

}

export default AttackMonitor