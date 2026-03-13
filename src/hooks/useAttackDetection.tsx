// src/hooks/useAttackDetection.ts
import { useCallback, useRef } from "react";
import { notificationService, AttackAlert } from "../service/notificationService";

interface AttackEvent {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  metadata?: Record<string, any>;
}

export function useAttackDetection() {

  const alertQueue = useRef<AttackAlert[]>([]);
  const processingRef = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateAlertId = () => {
    return `atk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  };

  const fetchClientIP = async (): Promise<string> => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch {
      return "unknown";
    }
  };

  const processAlertQueue = async () => {

    if (processingRef.current || alertQueue.current.length === 0) return;

    processingRef.current = true;

    while (alertQueue.current.length > 0) {
      const alert = alertQueue.current.shift();
      if (alert) {
        await notificationService.sendAttackAlert(alert);
      }
    }

    processingRef.current = false;
  };

  const debouncedProcess = () => {

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      processAlertQueue();
    }, 5000);

  };

  // Redirect attacker to honeypot server
  const redirectToHoneypot = async (payload: Record<string, any>) => {

    try {

      await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("🚨 Attacker redirected to honeypot");

    } catch (error) {

      console.error("Honeypot redirect failed", error);

    }

  };

  const detectAttack = useCallback(async (event: AttackEvent) => {

    const ip = event.metadata?.ip || await fetchClientIP();

    const alert: AttackAlert = {
      id: generateAlertId(),
      attackType: event.type,
      severity: event.severity,
      timestamp: new Date().toISOString(),
      sourceIP: ip,
      targetEndpoint: event.metadata?.endpoint || window.location.pathname,
      userAgent: navigator.userAgent,
      country: event.metadata?.country,
      details: event.metadata || {}
    };

    alertQueue.current.push(alert);

    if (event.severity === "critical" || event.severity === "high") {
      await processAlertQueue();
    } else {
      debouncedProcess();
    }

    return alert;

  }, []);

  // SQL Injection Detection
  const detectSQLInjection = useCallback((input: string, endpoint: string) => {

    const sqlPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /\bunion\b/i,
      /\bselect\b/i,
      /\binsert\b/i,
      /\bdelete\b/i,
      /\bdrop\b/i
    ];

    const detected = sqlPatterns.some((pattern) => pattern.test(input));

    if (detected) {

      detectAttack({
        type: "SQL Injection Attempt",
        severity: "critical",
        metadata: { input, endpoint }
      });

      redirectToHoneypot({
        attack: "SQL Injection",
        input,
        endpoint
      });

    }

    return detected;

  }, [detectAttack]);

  // XSS Detection
  const detectXSS = useCallback((input: string, endpoint: string) => {

    const xssPatterns = [
      /<script.*?>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /eval\(/gi
    ];

    const detected = xssPatterns.some((pattern) => pattern.test(input));

    if (detected) {

      detectAttack({
        type: "XSS Attack Attempt",
        severity: "high",
        metadata: { input: input.slice(0, 100), endpoint }
      });

      redirectToHoneypot({
        attack: "XSS",
        input,
        endpoint
      });

    }

    return detected;

  }, [detectAttack]);

  // Brute Force Detection
  const detectBruteForce = useCallback((ip: string, attempts: number) => {

    if (attempts >= 5) {

      detectAttack({
        type: "Brute Force Attack",
        severity: attempts > 10 ? "critical" : "high",
        metadata: { ip, attempts }
      });

      redirectToHoneypot({
        attack: "Brute Force",
        ip,
        attempts
      });

    }

  }, [detectAttack]);

  // DDoS Detection
  const detectDDoS = useCallback((ip: string, requestCount: number) => {

    if (requestCount > 100) {

      detectAttack({
        type: "Potential DDoS Attack",
        severity: requestCount > 500 ? "critical" : "high",
        metadata: { ip, requestCount }
      });

      redirectToHoneypot({
        attack: "DDoS",
        ip,
        requestCount
      });

    }

  }, [detectAttack]);

  return {
    detectAttack,
    detectSQLInjection,
    detectXSS,
    detectBruteForce,
    detectDDoS
  };

}