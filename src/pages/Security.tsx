import { useState, useEffect } from "react";
import { Shield, Key, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LoginSession {
  id: string;
  login_timestamp: string;
  device_info: string;
  ip_address: string;
}

const parseUserAgent = (userAgent: string) => {
  // Basic device detection
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);
  
  // Browser detection
  const browserPatterns = {
    'Chrome': /Chrome\/([0-9.]+)/,
    'Firefox': /Firefox\/([0-9.]+)/,
    'Safari': /Safari\/([0-9.]+)/,
    'Edge': /Edg\/([0-9.]+)/,
    'Opera': /OPR\/([0-9.]+)/
  };

  // OS detection
  const osPatterns = {
    'Windows': /Windows NT ([0-9.]+)/,
    'Mac': /Macintosh.*Mac OS X ([0-9._]+)/,
    'iOS': /iPhone OS ([0-9._]+)/,
    'Android': /Android ([0-9.]+)/,
    'Linux': /Linux/
  };

  // Determine device type
  let deviceType = 'Desktop';
  if (isTablet) deviceType = 'Tablet';
  else if (isMobile) deviceType = 'Mobile';

  // Determine browser
  let browser = 'Unknown Browser';
  for (const [name, pattern] of Object.entries(browserPatterns)) {
    if (pattern.test(userAgent)) {
      browser = name;
      break;
    }
  }

  // Determine OS
  let os = 'Unknown OS';
  for (const [name, pattern] of Object.entries(osPatterns)) {
    if (pattern.test(userAgent)) {
      os = name;
      break;
    }
  }

  return `${deviceType} - ${os} - ${browser}`;
};

export default function Security() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
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
        .order('login_timestamp', { ascending: false });

      if (error) throw error;
      setLoginSessions(data || []);
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

  const formatDeviceInfo = (deviceInfo: string | null) => {
    if (!deviceInfo) return 'Unknown Device';
    return parseUserAgent(deviceInfo);
  };

  const handleRemoveSession = async (sessionId: string) => {
    try {
      setIsDeletingSession(sessionId);
      
      const { error } = await supabase
        .from('login_history')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      // Update local state to remove the deleted session
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

  const validateCurrentPassword = async () => {
    setIsValidating(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: session?.user?.email || '',
        password: currentPassword,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return false;
      }
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to validate current password",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateCurrentPassword();
    if (!isValid) return;

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setNewPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggle2FA = async () => {
    setIs2FAEnabled(!is2FAEnabled);
    toast({
      title: "Coming Soon",
      description: "2FA functionality will be available soon!",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Security & Authentication</h2>
        <p className="text-muted-foreground">
          Manage your account security settings and authentication methods.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Password Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Password Management
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={isValidating}>
                {isValidating ? "Validating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 2FA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Two-Factor Authentication (2FA)
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable 2FA</Label>
                <p className="text-sm text-muted-foreground">
                  Protect your account with 2FA authentication.
                </p>
              </div>
              <Switch
                checked={is2FAEnabled}
                onCheckedChange={handleToggle2FA}
              />
            </div>
          </CardContent>
        </Card>

        {/* Connected Devices & Sessions */}
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
      </div>
    </div>
  );
}
