
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/landing');
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        // If there's an error getting the session, sign out and clear state
        handleSignOut();
      } else {
        setSession(initialSession);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession) => {
      console.log('Auth state changed:', event);
      
      switch (event) {
        case 'SIGNED_OUT':
          setSession(null);
          navigate('/landing');
          toast({
            title: "Signed Out",
            description: "You have been signed out successfully.",
          });
          break;
          
        case 'SIGNED_IN':
          setSession(currentSession);
          if (window.location.pathname === '/landing' || window.location.pathname === '/auth') {
            navigate('/app');
          }
          break;
          
        case 'TOKEN_REFRESHED':
          if (currentSession) {
            setSession(currentSession);
            if (window.location.pathname === '/landing' || window.location.pathname === '/auth') {
              navigate('/app');
            }
          } else {
            // If token refresh failed, sign out
            console.error('Token refresh failed - no session available');
            handleSignOut();
          }
          break;
          
        case 'USER_UPDATED':
          setSession(currentSession);
          toast({
            title: "Account Updated",
            description: "Your account information has been updated.",
          });
          break;
          
        case 'PASSWORD_RECOVERY':
          navigate('/auth');
          toast({
            title: "Password Recovery",
            description: "Please follow the instructions to reset your password.",
          });
          break;
          
        default:
          // Handle any other cases by signing out
          if (event === 'INITIAL_SESSION') {
            // Don't sign out for initial session event
            break;
          }
          console.error('Unhandled auth event:', event);
          handleSignOut();
          break;
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
