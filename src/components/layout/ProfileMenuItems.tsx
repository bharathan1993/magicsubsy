import { useNavigate } from "react-router-dom";
import { User, CreditCard, LogOut } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileMenuItemsProps {
  email: string | undefined;
  onLogout: () => void;
}

export function ProfileMenuItems({ email, onLogout }: ProfileMenuItemsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onLogout();
      navigate("/landing");
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">Account</p>
          <p className="text-xs leading-none text-muted-foreground">
            {email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => navigate('/app/account')}>
        <User className="mr-2 h-4 w-4" />
        <span>Account</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/app/billing')}>
        <CreditCard className="mr-2 h-4 w-4" />
        <span>Billing</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </>
  );
}