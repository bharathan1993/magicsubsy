<<<<<<< HEAD
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface LoginSession {
  id: string;
  login_timestamp: string;
  device_info: string;
  ip_address: string;
}

const parseUserAgent = (userAgent: string) => {
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);
  
  const browserPatterns = {
    'Chrome': /Chrome\/([0-9.]+)/,
    'Firefox': /Firefox\/([0-9.]+)/,
    'Safari': /Safari\/([0-9.]+)/,
    'Edge': /Edg\/([0-9.]+)/,
    'Opera': /OPR\/([0-9.]+)/
  };

  const osPatterns = {
    'Windows': /Windows NT ([0-9.]+)/,
    'Mac': /Macintosh.*Mac OS X ([0-9._]+)/,
    'iOS': /iPhone OS ([0-9._]+)/,
    'Android': /Android ([0-9.]+)/,
    'Linux': /Linux/
  };

  let deviceType = 'Desktop';
  if (isTablet) deviceType = 'Tablet';
  else if (isMobile) deviceType = 'Mobile';

  let browser = 'Unknown Browser';
  for (const [name, pattern] of Object.entries(browserPatterns)) {
    if (pattern.test(userAgent)) {
      browser = name;
      break;
    }
  }

  let os = 'Unknown OS';
  for (const [name, pattern] of Object.entries(osPatterns)) {
    if (pattern.test(userAgent)) {
      os = name;
      break;
    }
  }

  return `${deviceType} - ${os} - ${browser}`;
};

export const LoginSessions = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingSession, setIsDeletingSession] = useState<string | null>(null);

  useEffect(() => {
    fetchLoginSessions();
  }, []);

  const fetchLoginSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('login_timestamp', { ascending: false });

      if (error) throw error;

      const uniqueSessions = data?.reduce((acc: LoginSession[], current) => {
        const key = `${current.device_info}-${current.ip_address}`;
        const exists = acc.find(session => 
          `${session.device_info}-${session.ip_address}` === key
        );
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      setLoginSessions(uniqueSessions || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch login sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSession = async (sessionId: string) => {
    try {
      setIsDeletingSession(sessionId);
      
      const { error } = await supabase
        .from('login_history')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setLoginSessions(prevSessions => 
        prevSessions.filter(session => session.id !== sessionId)
      );

      toast({
        title: "Success",
        description: "Session removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove session",
        variant: "destructive",
      });
    } finally {
      setIsDeletingSession(null);
    }
  };

  const formatDeviceInfo = (deviceInfo: string | null) => {
    if (!deviceInfo) return 'Unknown Device';
    return parseUserAgent(deviceInfo);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Connected Devices & Sessions
        </CardTitle>
        <CardDescription>Manage your active sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading sessions...</p>
        ) : loginSessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Login Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{formatDeviceInfo(session.device_info)}</TableCell>
                  <TableCell>{session.ip_address || 'Unknown'}</TableCell>
                  <TableCell>{formatDate(session.login_timestamp)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveSession(session.id)}
                      disabled={isDeletingSession === session.id}
                    >
                      {isDeletingSession === session.id ? "Removing..." : "Remove"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No active sessions found</p>
        )}
      </CardContent>
    </Card>
  );
};
=======
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone, Laptop, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Session {
  id: string;
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
        const { data: authSessions, error } = await supabase.auth.getSession();
        if (error) throw error;

        // Get device info
        const userAgent = navigator.userAgent;
        const deviceType = /Mobile|Android|iPhone/i.test(userAgent) ? 'mobile' : 
                         /iPad|Tablet/i.test(userAgent) ? 'tablet' : 'desktop';
        
        // Get IP address and location info
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipResponse.json();
        
        // Get location info from IP
        const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await locationResponse.json();
        
        const formattedSessions: Session[] = [{
          id: authSessions?.id ?? 'current',
          device_type: deviceType,
          browser: getBrowserInfo(userAgent),
          ip_address: ip,
          location: `${locationData.city}, ${locationData.country_name}`,
          last_active: new Date().toISOString(),
          is_current: true
        }];

        setSessions(formattedSessions);
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
    const browsers = {
      chrome: /chrome/i,
      safari: /safari/i,
      firefox: /firefox/i,
      edge: /edge/i,
      opera: /opera/i
    };

    for (const [name, regex] of Object.entries(browsers)) {
      if (regex.test(userAgent)) return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'Unknown Browser';
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
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
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
            key={session.id}
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
              onClick={() => handleEndSession(session.id)}
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
>>>>>>> master
