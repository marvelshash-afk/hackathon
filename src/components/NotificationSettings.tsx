import { useState, useEffect } from 'react';
import { Bell, Mail, Phone, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    notification_email: '',
    notification_phone: '',
    notify_by_email: false,
    notify_by_sms: false,
  });

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('notification_email, notification_phone, notify_by_email, notify_by_sms')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setSettings({
          notification_email: data.notification_email || '',
          notification_phone: data.notification_phone || '',
          notify_by_email: data.notify_by_email || false,
          notify_by_sms: data.notify_by_sms || false,
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update(settings)
      .eq('user_id', user.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Settings saved', description: 'Notification preferences updated.' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Notification Preferences</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          Connect your email or phone to receive real-time attack alerts.
        </p>

        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setSettings(s => ({ ...s, notify_by_email: !s.notify_by_email }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  settings.notify_by_email ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all ${
                  settings.notify_by_email ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs font-medium text-foreground mb-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Email Notifications
              </label>
              <input
                type="email"
                value={settings.notification_email}
                onChange={e => setSettings(s => ({ ...s, notification_email: e.target.value }))}
                placeholder="alerts@example.com"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setSettings(s => ({ ...s, notify_by_sms: !s.notify_by_sms }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  settings.notify_by_sms ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all ${
                  settings.notify_by_sms ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs font-medium text-foreground mb-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                SMS Notifications
              </label>
              <input
                type="tel"
                value={settings.notification_phone}
                onChange={e => setSettings(s => ({ ...s, notification_phone: e.target.value }))}
                placeholder="+1 555 123 4567"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                SMS requires Twilio integration. Connect in Cloud settings.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
