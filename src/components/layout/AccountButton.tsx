import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, User } from "lucide-react";
import { SignInDialog } from "../auth/SignInDialog";
import { useToast } from "@/components/ui/use-toast";

export function AccountButton() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    setIsLoggedOut(true);
    toast({
      title: "Logged out successfully",
      description: "Please sign in to continue",
    });
  };

  const handleSignIn = () => {
    setIsLoggedOut(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isLoggedOut && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <SignInDialog isOpen={true} onSignIn={handleSignIn} />
        </div>
      )}
    </>
  );
}