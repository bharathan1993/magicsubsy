import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AvatarUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
}

export function AvatarUpload({ url, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${session?.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      onUpload(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={url || ""} alt="Avatar" />
        <AvatarFallback>
          {session?.user.email?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative"
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Change Picture
              <input
                type="file"
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
              />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}