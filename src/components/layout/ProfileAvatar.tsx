import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function ProfileAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    async function getProfile() {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (error) throw error;
        if (data) {
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error('Error loading avatar:', error);
      }
    }

    getProfile();
  }, [session]);

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={avatarUrl || ""} alt="Profile" />
      <AvatarFallback>{session?.user.email?.[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}