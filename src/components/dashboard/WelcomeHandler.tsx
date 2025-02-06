import { useEffect, useState } from "react";
import { Welcome } from "@/components/onboarding/Welcome";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function WelcomeHandler() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    const checkWelcomeStatus = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('User Accounts')
        .select('has_seen_welcome')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error checking welcome status:', error);
        return;
      }

      if (data && !data.has_seen_welcome) {
        setShowWelcome(true);
      }
    };

    checkWelcomeStatus();
  }, [session?.user?.id]);

  const handleCloseWelcome = async () => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from('User Accounts')
      .update({ has_seen_welcome: true })
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error updating welcome status:', error);
    }

    setShowWelcome(false);
  };

  return (
    <Welcome 
      open={showWelcome} 
      onClose={handleCloseWelcome} 
    />
  );
}