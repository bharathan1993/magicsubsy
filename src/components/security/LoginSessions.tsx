import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone, Laptop, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Session as SupabaseSession } from "@supabase/supabase-js";

interface Session {
  sessionId: string;
  device_type: string;
  browser: string;
  ip_address: string;
  location: string;
  last_active: string;
  is_current: boolean;
}

export function LoginSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { toast } = useToast();
  const { session: currentSession } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!currentSession?.user?.id) return;

        // Get auth sessions from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        // Get device info
        const userAgent = navigator.userAgent;
        const deviceType = /Mobile|Android|iPhone/i.test(userAgent) ? 'mobile' : 
                         /iPad|Tablet/i.test(userAgent) ? 'tablet' : 'desktop';
        
        // Get IP address and location info using free API
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const { ip } = await ipResponse.json();
          
          // Get location info from IP
          const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
          const locationData = await locationResponse.json();
          
          const formattedSessions: Session[] = [{
            sessionId: session?.id ?? 'current',
            device_type: deviceType,
            browser: getBrowserInfo(userAgent),
            ip_address: ip,
            location: `${locationData.city}, ${locationData.country_name}`,
            last_active: new Date().toISOString(),
            is_current: true
          }];

          setSessions(formattedSessions);
        } catch (apiError) {
          // Fallback if IP/location APIs fail
          const formattedSessions: Session[] = [{
            sessionId: session?.id ?? 'current',
            device_type: deviceType,
            browser: getBrowserInfo(userAgent),
            ip_address: 'Unknown',
            location: 'Unknown',
            last_active: new Date().toISOString(),
            is_current: true
          }];
          setSessions(formattedSessions);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast({
          title: "Error",
          description: "Failed to load session information",
          variant: "destructive",
        });
      }
    };

    fetchSessions();
  }, [currentSession?.user?.id, toast]);

  const getBrowserInfo = (userAgent: string): string => {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown Browser';
  };

  const formatLastActive = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      if (sessionId === 'current') {
        await supabase.auth.signOut();
        return;
      }

      // End specific session
      await supabase.auth.signOut({ scope: 'others' });
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      
      toast({
        title: "Success",
        description: "Session ended successfully",
      });
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end session",
        variant: "destructive",
      });
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Devices & Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions and connected devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.sessionId}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              {getDeviceIcon(session.device_type)}
              <div>
                <div className="font-medium">
                  {session.browser} on {session.device_type}
                  {session.is_current && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>IP: {session.ip_address}</div>
                  <div>Location: {session.location}</div>
                  <div>Last active: {formatLastActive(session.last_active)}</div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEndSession(session.sessionId)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
