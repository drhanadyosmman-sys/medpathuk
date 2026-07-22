import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff, Stethoscope, ArrowRight, User, Mail, Lock, Phone, Globe } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useT } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useEffect } from "react";

// Common graduation countries for UK IMG doctors
const GRADUATION_COUNTRIES = [
  "Egypt", "Pakistan", "India", "Nigeria", "Sudan", "Iraq", "Libya", "Jordan",
  "Saudi Arabia", "Yemen", "Syria", "Morocco", "Algeria", "Tunisia", "Lebanon",
  "Bangladesh", "Sri Lanka", "Ghana", "Kenya", "Zimbabwe", "South Africa",
  "Philippines", "Malaysia", "Myanmar", "Nepal", "Afghanistan", "Iran",
  "Turkey", "Romania", "Bulgaria", "Poland", "Hungary", "Ukraine",
  "Other"
];

export default function Register() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const t = useT();
  const utils = trpc.useUtils();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    whatsappNumber: "",
    graduationCountry: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success(t("auth.register.success"));
      navigate("/dashboard");
    },
    onError: (err) => {
      if (err.message.includes("already exists")) {
        setErrors({ email: t("auth.register.errors.exists") });
      } else {
        toast.error(err.message || t("auth.register.errors.failed"));
      }
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = t("auth.register.errors.name");
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("auth.register.errors.email");
    }
    if (!form.password || form.password.length < 8) {
      newErrors.password = t("auth.register.errors.password");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    registerMutation.mutate({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      whatsappNumber: form.whatsappNumber.trim() || undefined,
      graduationCountry: form.graduationCountry || undefined,
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
            {t("auth.register.heroTitle")}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("auth.register.heroBody")}
          </p>
          <div className="space-y-3">
            {[
              "Self-assessment across 46 UK specialties",
              "Criteria traced to official recruitment sources",
              "A roadmap built from your weakest domains",
              "Support for research, QI, audit and interviews",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
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
            <h2 className="text-3xl font-bold text-foreground">{t("auth.register.title")}</h2>
            <p className="mt-2 text-muted-foreground">
              {t("auth.register.haveAccount")}{" "}
              <a href="/login" className="text-primary hover:underline font-medium">
                {t("auth.register.signIn")}
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-foreground font-medium">
                {t("auth.register.name")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder={t("auth.register.namePlaceholder")}
                  value={form.name}
                  onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                  className={`ps-10 bg-card border-border text-foreground placeholder:text-muted-foreground ${errors.name ? "border-destructive" : ""}`}
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground font-medium">
                {t("auth.register.email")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.register.emailPlaceholder")}
                  value={form.email}
                  onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  className={`ps-10 bg-card border-border text-foreground placeholder:text-muted-foreground ${errors.email ? "border-destructive" : ""}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground font-medium">
                {t("auth.register.password")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.register.passwordPlaceholder")}
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  className={`ps-10 pe-10 bg-card border-border text-foreground placeholder:text-muted-foreground ${errors.password ? "border-destructive" : ""}`}
                  autoComplete="new-password"
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
            </div>

            {/* Graduation Country */}
            <div className="space-y-1.5">
              <Label htmlFor="graduationCountry" className="text-foreground font-medium">
                {t("auth.register.country")}
              </Label>
              <div className="relative">
                <Globe className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                <Select
                  value={form.graduationCountry}
                  onValueChange={(val) => setForm(p => ({ ...p, graduationCountry: val }))}
                >
                  <SelectTrigger className="w-full ps-10 bg-card border-border text-foreground">
                    <SelectValue placeholder={t("auth.register.countryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {GRADUATION_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country} className="text-foreground hover:bg-accent">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp" className="text-foreground font-medium">
                {t("auth.register.whatsapp")}
              </Label>
              <div className="relative">
                <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+44 7700 000000"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm(p => ({ ...p, whatsappNumber: e.target.value }))}
                  className="ps-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                  autoComplete="tel"
                />
              </div>
              <p className="text-muted-foreground text-xs">{t("auth.register.whatsappHint")}</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 transition-all active:scale-[0.98]"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {t("auth.register.creating")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t("auth.register.submit")}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-xs">
            {t("auth.register.terms")}
          </p>
        </div>
      </div>
    </div>
  );
}
