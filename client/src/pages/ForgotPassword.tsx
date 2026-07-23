import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Stethoscope, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function ForgotPassword() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => {
      setSent(true);
    },
    onError: (err) => {
      toast.error(err.message || t("auth.forgot.error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    forgotMutation.mutate({
      email: email.trim().toLowerCase(),
      origin: window.location.origin,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">MedPath UK</span>
        </div>

        <div className="flex justify-center">
          <LanguageToggle />
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{t("auth.forgot.sentTitle")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("auth.forgot.sentBody", { email })}
            </p>
            <p className="text-muted-foreground text-sm">{t("auth.forgot.expires")}</p>
            <a href="/login" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium mt-4">
              <ArrowLeft className="w-4 h-4" />
              {t("auth.forgot.backToLogin")}
            </a>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-3xl font-bold text-foreground">{t("auth.forgot.title")}</h2>
              <p className="mt-2 text-muted-foreground">
                {t("auth.forgot.body")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground font-medium">{t("auth.forgot.email")}</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ps-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                    autoFocus
                    autoComplete="email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 transition-all active:scale-[0.98]"
                disabled={forgotMutation.isPending || !email.trim()}
              >
                {forgotMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    {t("auth.forgot.sending")}
                  </span>
                ) : t("auth.forgot.submit")}
              </Button>
            </form>

            <div className="text-center">
              <a href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t("auth.forgot.backToLogin")}
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
