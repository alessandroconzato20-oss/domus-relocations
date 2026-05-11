import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Setup2FA() {
  const [, setLocation] = useLocation();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [isLoading, setIsLoading] = useState(false);

  const setupTotpMutation = trpc.twoFactor.setupTotp.useMutation();
  const verifyTotpMutation = trpc.twoFactor.verifyTotp.useMutation();

  const handleSetupTotp = async () => {
    setIsLoading(true);
    try {
      const result = await setupTotpMutation.mutateAsync();
      if (result.success) {
        setQrCode(result.qrCode || null);
        setBackupCodes(result.backupCodes || []);
        setStep("verify");
        toast.success("Scan the QR code with your authenticator app");
      } else {
        toast.error(result.message || "Failed to setup 2FA");
      }
    } catch (error) {
      console.error("Setup 2FA error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTotp = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyTotpMutation.mutateAsync({
        code: verificationCode,
      });
      if (result.success) {
        toast.success("2FA enabled successfully!");
        setLocation("/admin");
      } else {
        toast.error(result.message || "Invalid code");
      }
    } catch (error) {
      console.error("Verify 2FA error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-serif font-bold mb-2">Set Up Two-Factor Authentication</h1>
        <p className="text-secondary-foreground mb-6">Secure your admin account with 2FA</p>

        {step === "setup" ? (
          <div className="space-y-4">
            <p className="text-sm text-secondary-foreground">
              Two-factor authentication adds an extra layer of security to your account. You'll need to enter a code from your authenticator app in addition to your password when logging in.
            </p>
            <Button 
              onClick={handleSetupTotp} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Setting up..." : "Start Setup"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {qrCode && (
              <div className="flex flex-col items-center">
                <p className="text-sm text-secondary-foreground mb-4">Scan this QR code with your authenticator app:</p>
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 border border-border rounded-lg p-2" />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Enter the 6-digit code from your app:</label>
              <Input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="mt-2 text-center text-2xl tracking-widest"
              />
            </div>

            {backupCodes.length > 0 && (
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Save your backup codes:</p>
                <div className="space-y-1 text-xs font-mono">
                  {backupCodes.map((code, index) => (
                    <p key={index}>{code}</p>
                  ))}
                </div>
                <p className="text-xs text-secondary-foreground mt-2">
                  Keep these codes in a safe place. You can use them to access your account if you lose your authenticator device.
                </p>
              </div>
            )}

            <Button 
              onClick={handleVerifyTotp} 
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full"
            >
              {isLoading ? "Verifying..." : "Verify & Enable 2FA"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
