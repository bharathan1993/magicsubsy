import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarUpload } from "@/components/account/AvatarUpload";

interface Profile {
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  avatar_url: string;
}

export default function Account() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    username: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    avatar_url: "",
  });

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      if (!session?.user) throw new Error("No user");

      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          ...data,
          date_of_birth: data.date_of_birth || "",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error loading user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      if (!session?.user) throw new Error("No user");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          username: profile.username,
          phone_number: profile.phone_number,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender,
          avatar_url: profile.avatar_url,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/app')} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AvatarUpload
              url={profile.avatar_url}
              onUpload={(url) => {
                setProfile({ ...profile, avatar_url: url });
                updateProfile();
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.first_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.last_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username || ""}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={session?.user?.email || ""}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone_number || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone_number: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profile.date_of_birth}
                onChange={(e) =>
                  setProfile({ ...profile, date_of_birth: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender (Optional)</Label>
              <Select
                value={profile.gender || ""}
                onValueChange={(value) =>
                  setProfile({ ...profile, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={updateProfile} className="w-full">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}