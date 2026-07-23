import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Stethoscope, ArrowRight, Mail, Lock } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useT } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function Login() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const t = useT();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success(t("auth.login.success"));
      navigate("/dashboard");
    },
    onError: (err) => {
      setErrors({ general: err.message || t("auth.login.invalid") });
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email.trim()) newErrors.email = t("auth.login.emailRequired");
    if (!form.password) newErrors.password = t("auth.login.passwordRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    loginMutation.mutate({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex-col justify-between p-12 border-r border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">MedPath UK</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            {t("auth.login.welcome")}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("auth.login.intro")}
          </p>
          <div className="bg-card/50 border border-border rounded-xl p-5 space-y-3">
            <p className="text-foreground font-medium text-sm">{t("auth.login.waitingHeading")}</p>
            {[
              t("auth.login.waiting.roadmap"),
              t("auth.login.waiting.history"),
              t("auth.login.waiting.workspaces"),
              t("auth.login.waiting.progress"),
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          {t("common.footer.rights")}
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MedPath UK</span>
          </div>

          <div className="flex justify-end">
            <LanguageToggle />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-foreground">{t("auth.login.title")}</h2>
            <p className="mt-2 text-muted-foreground">
              {t("auth.login.noAccount")}{" "}
              <a href="/register" className="text-primary hover:underline font-medium">
                {t("auth.login.createOne")}
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General error */}
            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-destructive text-sm">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground font-medium">
                {t("auth.login.email")}
              </Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm(p => ({ ...p, email: e.target.value }));
                    setErrors(p => ({ ...p, email: "", general: "" }));
                  }}
                  className={`ps-10 bg-card border-border text-foreground placeholder:text-muted-foreground ${errors.email ? "border-destructive" : ""}`}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground font-medium">
                {t("auth.login.password")}
              </Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.login.passwordPlaceholder")}
                  value={form.password}
                  onChange={(e) => {
                    setForm(p => ({ ...p, password: e.target.value }));
                    setErrors(p => ({ ...p, password: "", general: "" }));
                  }}
                  className={`ps-10 pe-10 bg-card border-border text-foreground placeholder:text-muted-foreground ${errors.password ? "border-destructive" : ""}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
              <div className="text-end">
                <a href="/forgot-password" className="text-sm text-primary hover:underline">{t("auth.login.forgot")}</a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 transition-all active:scale-[0.98]"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {t("auth.login.signingIn")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t("auth.login.submit")}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center">
            <a href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              {t("auth.login.backHome")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
