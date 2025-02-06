import { PasswordManagement } from "@/components/security/PasswordManagement";
import { TwoFactorAuth } from "@/components/security/TwoFactorAuth";
import { LoginSessions } from "@/components/security/LoginSessions";

export default function Security() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Security & Authentication</h2>
        <p className="text-muted-foreground">
          Manage your account security settings and authentication methods.
        </p>
      </div>

      <div className="grid gap-6">
        <PasswordManagement />
        <TwoFactorAuth />
        <LoginSessions />
      </div>
    </div>
  );
}