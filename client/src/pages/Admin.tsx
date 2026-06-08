import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown, Loader2, Plus, Shield, Stethoscope, User, Users,
  Key, Copy, Check, Trash2, RefreshCw, Star, Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const TIER_COLORS: Record<string, string> = {
  free: "bg-secondary text-secondary-foreground",
  pro: "bg-primary/10 text-primary",
  premium: "bg-amber-100 text-amber-700",
};

const TIER_ICONS: Record<string, typeof Zap> = {
  free: Zap,
  pro: Star,
  premium: Crown,
};

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [newCodeEmail, setNewCodeEmail] = useState("");
  const [newCodeTier, setNewCodeTier] = useState<"free" | "pro" | "premium">("pro");
  const [newCodeExpiry, setNewCodeExpiry] = useState<number | undefined>(undefined);
  const [newCodeNotes, setNewCodeNotes] = useState("");
  const [generating, setGenerating] = useState(false);

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = trpc.admin.getUsers.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const { data: codesData, isLoading: codesLoading, refetch: refetchCodes } = trpc.admin.getCodes.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const generateCode = trpc.admin.generateCode.useMutation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You don't have permission to view this page.</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Code copied to clipboard!");
  };

  const handleGenerateCode = async () => {
    if (!newCodeEmail) {
      toast.error("Please enter an email address.");
      return;
    }
    setGenerating(true);
    try {
      const result = await generateCode.mutateAsync({
        email: newCodeEmail,
        tier: newCodeTier,
        notes: newCodeNotes || undefined,
        expiresInDays: newCodeExpiry,
      });
      toast.success(`Access code generated: ${result.code}`);
      handleCopyCode(result.code);
      setNewCodeEmail("");
      setNewCodeNotes("");
      refetchCodes();
    } catch (e: any) {
      toast.error(e.message || "Failed to generate code.");
    } finally {
      setGenerating(false);
    }
  };

  const users = usersData ?? [];
  const codes = codesData ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Manas</span>
            <Badge className="bg-red-100 text-red-700 ml-2">Admin</Badge>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/roadmap", label: "Roadmap" },
              { href: "/workspaces", label: "AI Workspaces" },
            ].map(item => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">{item.label}</Button>
              </Link>
            ))}
          </nav>
          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage users, access codes, and platform settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: users.length, icon: Users, color: "text-blue-500" },
            { label: "Active Codes", value: codes.filter((c: any) => !c.usedAt).length, icon: Key, color: "text-green-500" },
            { label: "Used Codes", value: codes.filter((c: any) => c.usedAt).length, icon: Check, color: "text-purple-500" },
            { label: "Premium Users", value: users.filter((u: any) => u.subscriptionTier === "premium").length, icon: Crown, color: "text-amber-500" },
          ].map((stat, i) => {
            const StatIcon = stat.icon;
            return (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <StatIcon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generate Access Code */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Key className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Generate Access Code</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address *</label>
                <input
                  type="email"
                  placeholder="doctor@example.com"
                  value={newCodeEmail}
                  onChange={e => setNewCodeEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Subscription Tier</label>
                <select
                  value={newCodeTier}
                  onChange={e => setNewCodeTier(e.target.value as "free" | "pro" | "premium")}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="free">Starter (Free)</option>
                  <option value="pro">Professional (£29.99/mo)</option>
                  <option value="premium">Premium (£79.99/mo)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Expires in (days, optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={newCodeExpiry ?? ""}
                  onChange={e => setNewCodeExpiry(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Notes (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Referred by Dr. Ahmed"
                  value={newCodeNotes}
                  onChange={e => setNewCodeNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <Button
                onClick={handleGenerateCode}
                disabled={generating || !newCodeEmail}
                className="w-full gradient-purple text-white border-0"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                ) : (
                  <><Plus className="w-4 h-4 mr-2" />Generate & Copy Code</>
                )}
              </Button>
            </div>
          </div>

          {/* Access Codes List */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Access Codes</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => refetchCodes()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {codesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : codes.length === 0 ? (
              <div className="text-center py-8">
                <Key className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No access codes yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {codes.map((code: any) => {
                  const TierIcon = TIER_ICONS[code.subscriptionTier] || Zap;
                  return (
                    <div key={code.id} className={`flex items-center gap-3 p-3 rounded-lg border ${code.usedAt ? "border-border bg-secondary/30 opacity-60" : "border-border bg-background"}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono font-bold text-foreground">{code.code}</code>
                          <Badge className={`text-xs ${TIER_COLORS[code.subscriptionTier]}`}>
                            <TierIcon className="w-2.5 h-2.5 mr-1" />{code.subscriptionTier}
                          </Badge>
                          {code.usedAt && <Badge className="text-xs bg-green-100 text-green-700">Used</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 truncate">{code.email}</div>
                        {code.notes && <div className="text-xs text-muted-foreground/70 truncate">{code.notes}</div>}
                      </div>
                      {!code.usedAt && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(code.code)}
                          className="flex-shrink-0"
                        >
                          {copiedCode === code.code ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-8 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Registered Users</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => refetchUsers()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No users registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Specialty</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Tier</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Role</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => {
                    const TierIcon = TIER_ICONS[u.subscriptionTier] || Zap;
                    return (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-foreground">{u.name || "—"}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{u.email || "—"}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{u.specialty || "—"}</td>
                        <td className="py-2.5 px-3">
                          <Badge className={`text-xs ${TIER_COLORS[u.subscriptionTier || "free"]}`}>
                            <TierIcon className="w-2.5 h-2.5 mr-1" />{u.subscriptionTier || "free"}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge className={u.role === "admin" ? "bg-red-100 text-red-700 text-xs" : "bg-secondary text-secondary-foreground text-xs"}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground text-xs">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
