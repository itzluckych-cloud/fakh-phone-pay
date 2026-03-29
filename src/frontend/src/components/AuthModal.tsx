import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AuthModalProps {
  mode: "signin" | "signup" | null;
  onClose: () => void;
}

export default function AuthModal({ mode, onClose }: AuthModalProps) {
  const { login, isLoggingIn, isLoginSuccess, isLoginError, loginError } =
    useInternetIdentity();

  const handleLogin = () => {
    login();
  };

  // Close on success
  if (isLoginSuccess && mode !== null) {
    onClose();
  }

  return (
    <Dialog open={mode !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="auth.modal">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl text-secondary">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {mode === "signin"
              ? "Sign in to access your Fakh Phone Pay account."
              : "Create a new Fakh Phone Pay account to get started."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <div className="bg-muted rounded-lg p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Fakh Phone Pay uses Internet Identity for secure, passwordless
              authentication. Your identity is fully under your control.
            </p>
          </div>

          {isLoginError && (
            <p
              className="text-sm text-destructive"
              data-ocid="auth.error_state"
            >
              {loginError?.message ||
                "Authentication failed. Please try again."}
            </p>
          )}

          <Button
            className="w-full bg-primary text-white hover:bg-primary/90"
            onClick={handleLogin}
            disabled={isLoggingIn}
            data-ocid="auth.submit_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
              </>
            ) : mode === "signin" ? (
              "Sign In with Internet Identity"
            ) : (
              "Create Account with Internet Identity"
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            data-ocid="auth.cancel_button"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
