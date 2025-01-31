import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInDialog } from "@/components/auth/SignInDialog";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileMenuItems } from "./ProfileMenuItems";

export function AccountButton() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { session } = useAuth();

  const handleSignInSuccess = () => {
    setIsSignInOpen(false);
  };

  // If not logged in, show only the sign in dialog
  if (!session) {
    return (
      <SignInDialog 
        open={isSignInOpen} 
        onOpenChange={setIsSignInOpen}
        onSignInSuccess={handleSignInSuccess}
      />
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <ProfileAvatar />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <ProfileMenuItems 
            email={session.user.email} 
            onLogout={() => setIsSignInOpen(false)}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <SignInDialog 
        open={isSignInOpen} 
        onOpenChange={setIsSignInOpen}
        onSignInSuccess={handleSignInSuccess}
      />
    </>
  );
}