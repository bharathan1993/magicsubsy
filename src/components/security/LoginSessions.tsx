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