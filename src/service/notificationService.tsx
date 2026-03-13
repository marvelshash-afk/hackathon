// src/services/notificationService.ts

export interface AttackAlert {
  id: string;
  attackType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  sourceIP?: string;
  targetEndpoint?: string;
  details: Record<string, any>;
  userAgent?: string;
  country?: string;
}

interface NotificationConfig {
  sendEmail: boolean;
  sendSMS: boolean;
  sendSlack: boolean;
}

class NotificationService {
  private config: NotificationConfig;

  constructor(config: Partial<NotificationConfig> = {}) {
    this.config = {
      sendEmail: true,
      sendSMS: true,
      sendSlack: false,
      ...config
    };
  }

  async sendAttackAlert(alert: AttackAlert): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.config.sendEmail) {
      promises.push(this.sendEmailNotification(alert));
    }

    if (this.config.sendSMS) {
      promises.push(this.sendSMSNotification(alert));
    }

    if (this.config.sendSlack) {
      promises.push(this.sendSlackNotification(alert));
    }

    try {
      await Promise.allSettled(promises);
      console.log(`[NotificationService] Alerts sent for attack ${alert.id}`);
    } catch (error) {
      console.error('[NotificationService] Failed to send notifications:', error);
    }
  }

  private async sendEmailNotification(alert: AttackAlert): Promise<void> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: import.meta.env.VITE_EMAIL_FROM || 'Guardian AI <security@guardian-ai.com>',
          to: [import.meta.env.VITE_EMAIL_TO],
          subject: `🚨 SECURITY ALERT: ${alert.severity.toUpperCase()} - ${alert.attackType}`,
          html: this.generateEmailTemplate(alert),
          text: this.generateEmailText(alert)
        })
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`);
      }

      console.log('[Email] Notification sent successfully');
    } catch (error) {
      console.error('[Email] Failed to send:', error);
      throw error;
    }
  }

  private async sendSMSNotification(alert: AttackAlert): Promise<void> {
    // Only send SMS for high and critical severity
    if (alert.severity === 'low' || alert.severity === 'medium') {
      return;
    }

    try {
      const message = this.generateSMSMessage(alert);
      
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${import.meta.env.VITE_TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_TWILIO_ACCOUNT_SID}:${import.meta.env.VITE_TWILIO_AUTH_TOKEN}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: import.meta.env.VITE_SMS_TO || '',
          From: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '',
          Body: message
        })
      });

      if (!response.ok) {
        throw new Error(`Twilio API error: ${response.statusText}`);
      }

      console.log('[SMS] Notification sent successfully');
    } catch (error) {
      console.error('[SMS] Failed to send:', error);
      throw error;
    }
  }

  private async sendSlackNotification(alert: AttackAlert): Promise<void> {
    const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
      const color = this.getSeverityColor(alert.severity);
      
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attachments: [{
            color: color,
            title: `🚨 Security Alert: ${alert.attackType}`,
            fields: [
              { title: 'Severity', value: alert.severity.toUpperCase(), short: true },
              { title: 'Time', value: alert.timestamp, short: true },
              { title: 'Source IP', value: alert.sourceIP || 'Unknown', short: true },
              { title: 'Target', value: alert.targetEndpoint || 'N/A', short: true },
              { title: 'Details', value: JSON.stringify(alert.details, null, 2) }
            ],
            footer: 'Guardian AI Security System',
            ts: Math.floor(new Date(alert.timestamp).getTime() / 1000)
          }]
        })
      });
    } catch (error) {
      console.error('[Slack] Failed to send:', error);
    }
  }

  private generateEmailTemplate(alert: AttackAlert): string {
    const severityColors = {
      low: '#22c55e',
      medium: '#f59e0b',
      high: '#f97316',
      critical: '#dc2626'
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${severityColors[alert.severity]}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .label { font-weight: 600; color: #6b7280; }
    .value { color: #111827; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .severity-${alert.severity} { background: ${severityColors[alert.severity]}20; color: ${severityColors[alert.severity]}; }
    .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ Guardian AI Security Alert</h1>
      <span class="badge severity-${alert.severity}">${alert.severity}</span>
    </div>
    <div class="content">
      <h2>${alert.attackType}</h2>
      <p>An attack has been detected and blocked by your Guardian AI security system.</p>
      
      <div class="detail-row">
        <span class="label">Attack ID</span>
        <span class="value">${alert.id}</span>
      </div>
      <div class="detail-row">
        <span class="label">Timestamp</span>
        <span class="value">${new Date(alert.timestamp).toLocaleString()}</span>
      </div>
      <div class="detail-row">
        <span class="label">Source IP</span>
        <span class="value">${alert.sourceIP || 'Unknown'}</span>
      </div>
      <div class="detail-row">
        <span class="label">Target Endpoint</span>
        <span class="value">${alert.targetEndpoint || 'N/A'}</span>
      </div>
      <div class="detail-row">
        <span class="label">Country</span>
        <span class="value">${alert.country || 'Unknown'}</span>
      </div>
      <div class="detail-row">
        <span class="label">User Agent</span>
        <span class="value">${alert.userAgent || 'N/A'}</span>
      </div>
      
      <h3>Attack Details</h3>
      <pre style="background: #f3f4f6; padding: 15px; border-radius: 6px; overflow-x: auto;">
${JSON.stringify(alert.details, null, 2)}
      </pre>
    </div>
    <div class="footer">
      <p>Guardian AI - Automated Security Monitoring</p>
      <p>Attack ID: ${alert.id}</p>
    </div>
  </div>
</body>
</html>`;
  }

  private generateEmailText(alert: AttackAlert): string {
    return `
GUARDIAN AI SECURITY ALERT
==========================

Severity: ${alert.severity.toUpperCase()}
Attack Type: ${alert.attackType}
Attack ID: ${alert.id}
Time: ${alert.timestamp}

SOURCE INFORMATION
------------------
Source IP: ${alert.sourceIP || 'Unknown'}
Target: ${alert.targetEndpoint || 'N/A'}
Country: ${alert.country || 'Unknown'}
User Agent: ${alert.userAgent || 'N/A'}

DETAILS
-------
${JSON.stringify(alert.details, null, 2)}

---
Guardian AI Security System
`;
  }

  private generateSMSMessage(alert: AttackAlert): string {
    return `🚨 GUARDIAN AI ALERT [${alert.severity.toUpperCase()}] ${alert.attackType} detected from ${alert.sourceIP || 'Unknown'} at ${new Date(alert.timestamp).toLocaleTimeString()}. ID: ${alert.id.slice(0, 8)}`;
  }

  private getSeverityColor(severity: string): string {
    const colors = {
      low: '#22c55e',
      medium: '#f59e0b',
      high: '#f97316',
      critical: '#dc2626'
    };
    return colors[severity as keyof typeof colors] || '#6b7280';
  }
}

export const notificationService = new NotificationService();
export default NotificationService;