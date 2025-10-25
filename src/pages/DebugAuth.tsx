import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { debugUserState, createUserRecord } from "@/utils/authDebug";
import { useToast } from "@/components/ui/use-toast";

export default function DebugAuth() {
  const [email, setEmail] = useState("itzbharathan@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string>("");
  const { toast } = useToast();

  const handleDebug = async () => {
    setLoading(true);
    setResults("Checking user state...");
    
    try {
      // Capture console output
      const originalLog = console.log;
      const logs: string[] = [];
      
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalLog(...args);
      };
      
      await debugUserState(email);
      
      // Restore console.log
      console.log = originalLog;
      
      setResults(logs.join('\n'));
    } catch (error: any) {
      setResults(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await createUserRecord(email, password);
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug Tool</CardTitle>
            <CardDescription>
              Debug authentication issues with specific email addresses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to debug"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password (for user creation)</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleDebug} 
                disabled={loading}
                variant="outline"
              >
                {loading ? "Debugging..." : "Debug User State"}
              </Button>
              <Button 
                onClick={handleCreateUser} 
                disabled={loading || !password}
              >
                {loading ? "Creating..." : "Create User Record"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96">
                {results}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}