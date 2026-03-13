// src/components/NotificationSettings.tsx

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, MessageSquare, Bell, TestTube } from "lucide-react";
import { notificationService } from "@/service/notificationService";

export const NotificationSettings: React.FC = () => {

  const [settings, setSettings] = useState({
    emailEnabled: true,
    smsEnabled: true,
    slackEnabled: false,
    emailTo: import.meta.env.VITE_EMAIL_TO || "",
    smsTo: import.meta.env.VITE_SMS_TO || "",
    minSeverity: "medium" as "low" | "medium" | "high" | "critical"
  });

  const [testing, setTesting] = useState(false);

  const handleTestNotification = async (type: "email" | "sms") => {

    setTesting(true);

    try {

      await notificationService.sendAttackAlert({
        id: `test_${Date.now()}`,
        attackType: "Test Notification",
        severity: "high",
        timestamp: new Date().toISOString(),
        sourceIP: "127.0.0.1",
        targetEndpoint: "/test",
        country: "Localhost",
        details: {
          message: `Guardian AI test ${type} notification`,
          test: true
        }
      });

      alert(`Test ${type} sent! Check your ${type === "email" ? "email inbox" : "phone"}.`);

    } catch (error) {

      console.error(error);
      alert(`Failed to send test ${type}. Check console.`);

    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* EMAIL SETTINGS */}
        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <Label className="font-medium">Email Notifications</Label>
            </div>

            <Switch
              checked={settings.emailEnabled}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, emailEnabled: checked }))
              }
            />
          </div>

          {settings.emailEnabled && (
            <div className="pl-6 space-y-2">

              <Label>Recipient Email</Label>

              <Input
                type="email"
                value={settings.emailTo}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, emailTo: e.target.value }))
                }
                placeholder="admin@yourdomain.com"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestNotification("email")}
                disabled={testing}
              >
                <TestTube className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>

            </div>
          )}

        </div>


        {/* SMS SETTINGS */}
        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <Label className="font-medium">SMS Notifications</Label>
            </div>

            <Switch
              checked={settings.smsEnabled}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, smsEnabled: checked }))
              }
            />
          </div>

          {settings.smsEnabled && (
            <div className="pl-6 space-y-2">

              <Label>Recipient Phone</Label>

              <Input
                type="tel"
                value={settings.smsTo}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, smsTo: e.target.value }))
                }
                placeholder="+919876543210"
              />

              <p className="text-xs text-muted-foreground">
                Only high and critical alerts trigger SMS.
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestNotification("sms")}
                disabled={testing}
              >
                <TestTube className="w-4 h-4 mr-2" />
                Send Test SMS
              </Button>

            </div>
          )}

        </div>


        {/* SEVERITY LEVEL */}
        <div className="space-y-2">

          <Label>Minimum Severity for Notifications</Label>

          <select
            className="w-full p-2 border rounded-md"
            value={settings.minSeverity}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                minSeverity: e.target.value as any
              }))
            }
          >
            <option value="low">All (Low and above)</option>
            <option value="medium">Medium and above</option>
            <option value="high">High and above</option>
            <option value="critical">Critical only</option>
          </select>

        </div>

        <div className="pt-4 border-t">
          <Button className="w-full">Save Settings</Button>
        </div>

      </CardContent>

    </Card>
  );
};

export default NotificationSettings;