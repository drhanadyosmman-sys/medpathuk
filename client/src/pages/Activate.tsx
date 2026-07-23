import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { ArrowRight, CheckCircle2, KeyRound, Lock, Mail, Stethoscope } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useT } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function Activate() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const t = useT();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [activated, setActivated] = useState(false);

  const validateCode = trpc.accessCode.validate.useMutation({
    onSuccess: (data) => {
      setActivated(true);
      toast.success(t("activate.toast.success", { tier: data.tier?.toUpperCase() ?? "" }));
      setTimeout(() => navigate("/onboarding"), 2000);
    },
    onError: (err) => {
      toast.error(err.message || t("activate.toast.invalid"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !email.trim()) {
      toast.error(t("activate.toast.missing"));
      return;
    }
    validateCode.mutate({ code: code.trim().toUpperCase(), email: email.trim() });
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Already activated
  if (isAuthenticated && user?.isActivated) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex justify-end mb-4">
          <LanguageToggle />
        </div>
        <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t("activate.already.title")}</h2>
          <p className="text-white/70 mb-6">{t("activate.already.body")}</p>
          <Button onClick={() => navigate("/dashboard")} className="gradient-orange text-white border-0 w-full">
            {t("activate.already.cta")} <ArrowRight className="w-4 h-4 ms-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md flex justify-end mb-4">
          <LanguageToggle />
        </div>
        <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t("activate.signIn.title")}</h2>
          <p className="text-white/70 mb-6">
            {t("activate.signIn.body")}
          </p>
          <a href="/login">
            <Button className="gradient-orange text-white border-0 w-full">
              {t("activate.signIn.cta")} <ArrowRight className="w-4 h-4 ms-2" />
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 start-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 end-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-3 shadow-xl">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">MedPath UK</h1>
          <p className="text-white/60 text-sm">{t("activate.brandBy")}</p>
        </div>

        {activated ? (
          <div className="glass rounded-2xl p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">{t("activate.success.title")}</h2>
            <p className="text-white/70 mb-4">{t("activate.success.body")}</p>
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{t("activate.form.title")}</h2>
                <p className="text-white/60 text-sm">{t("activate.form.subtitle")}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-white/80 text-sm mb-1.5 block">{t("activate.form.codeLabel")}</Label>
                <div className="relative">
                  <KeyRound className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="XXXX-XXXX-XXXX"
                    className="ps-10 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-purple-400 uppercase tracking-widest font-mono"
                    maxLength={20}
                  />
                </div>
              </div>

              <div>
                <Label className="text-white/80 text-sm mb-1.5 block">{t("activate.form.emailLabel")}</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="ps-10 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-purple-400"
                  />
                </div>
                <p className="text-white/40 text-xs mt-1.5">
                  {t("activate.form.emailHint")}
                </p>
              </div>

              <Button
                type="submit"
                disabled={validateCode.isPending || !code || !email}
                className="w-full gradient-orange text-white border-0 py-5 font-semibold"
              >
                {validateCode.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin me-2" />
                    {t("activate.form.verifying")}
                  </>
                ) : (
                  <>
                    {t("activate.form.submit")} <ArrowRight className="w-4 h-4 ms-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/50 text-xs text-center">
                {t("activate.form.note")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
