import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Loader2,
  Microscope,
  MessageSquare,
  Send,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Streamdown } from "streamdown";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

type WorkspaceKey = "research" | "qip" | "audit" | "teaching" | "presentation" | "interview" | "oet" | "cv" | "pathway" | "general";

// Visual/structural metadata only. Titles and descriptions are translated and
// live in the `chat` dictionary, keyed by `key`.
const WORKSPACES: { key: WorkspaceKey; icon: any; color: string; badge?: boolean }[] = [
  { key: "research", icon: Microscope, color: "from-purple-500 to-purple-700", badge: true },
  { key: "qip", icon: TrendingUp, color: "from-blue-500 to-blue-700" },
  { key: "audit", icon: ClipboardList, color: "from-indigo-500 to-indigo-700" },
  { key: "teaching", icon: GraduationCap, color: "from-violet-500 to-violet-700" },
  { key: "presentation", icon: Star, color: "from-orange-500 to-orange-600" },
  { key: "interview", icon: MessageSquare, color: "from-amber-500 to-amber-600", badge: true },
  { key: "oet", icon: BookOpen, color: "from-green-500 to-green-700" },
  { key: "cv", icon: FileText, color: "from-teal-500 to-teal-700" },
  { key: "pathway", icon: Target, color: "from-rose-500 to-rose-700" },
  { key: "general", icon: Brain, color: "from-pink-500 to-pink-700" },
];

// Left in English on purpose: clicking a suggestion sends it verbatim to the AI
// as the message prompt. These are prompt text, not interface labels, so they
// are not translated here (the model replies in the user's language regardless).
const SUGGESTED: Record<WorkspaceKey, string[]> = {
  research: ["How do I choose a suitable journal using Think.Check.Submit.?", "Explain ICMJE authorship criteria", "Help me write a research abstract", "What's the difference between a case report and a case series?"],
  qip: ["Help me design a PDSA cycle for my QI project", "What makes a good QI project for a medical portfolio?", "How do I measure baseline data for a QIP?", "Help me write a QIP summary for my portfolio"],
  audit: ["How do I select a topic for a clinical audit?", "What standards should I use for an audit on sepsis management?", "Help me plan a re-audit after implementing changes", "How do I present audit results at a departmental meeting?"],
  teaching: ["Help me plan a 30-minute teaching session on ECG interpretation", "How do I write learning objectives?", "What evidence should I include in my teaching portfolio?", "How do I get feedback on my teaching sessions?"],
  presentation: ["Help me write a conference abstract", "How do I design an effective medical poster?", "What should I include in a 10-minute oral presentation?", "How do I find relevant conferences to submit to?"],
  interview: ["What are common questions in a Core Medical Training interview?", "Help me prepare a STAR answer about a clinical challenge", "What should I know about the person specification?", "How do I demonstrate commitment to the specialty?"],
  oet: ["Explain the OET Writing sub-test format", "Help me practice an OET Speaking roleplay for a doctor", "What score do I need for GMC registration?", "Give me tips for the OET Reading sub-test"],
  pathway: ["What is the PLAB pathway for international doctors?", "How do I apply through Oriel for specialty training?", "What are the steps to register with the GMC?", "How do I find NHS jobs as an IMG?"],
  cv: ["Review my medical CV structure", "What should I include in a specialty training application CV?", "How do I map my portfolio evidence to a person specification?", "What are the most important CV sections for a surgical application?"],
  general: ["What is the typical timeline to get a training post in the UK?", "What's the difference between CMT and IMT?", "How do I build a competitive portfolio in 12 months?", "What support does MedPath UK offer for my career stage?"],
};

export default function Chat() {
  const { user, isAuthenticated, loading } = useAuth();
  const t = useT();
  const { dict, language } = useLanguage();
  // Translated title/desc for a workspace, keyed by its stable code key.
  const wsMeta = (key: WorkspaceKey) => dict.chat.workspaces[key];
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceKey | null>(null);
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<{ role: "user" | "assistant"; content: string; id: string }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: history } = trpc.chat.getHistory.useQuery(
    { workspace: selectedWorkspace ?? "general" },
    { enabled: isAuthenticated && !!selectedWorkspace }
  );
  const sendMessage = trpc.chat.sendMessage.useMutation();

  useEffect(() => {
    if (history && localMessages.length === 0) {
      setLocalMessages(history.map(m => ({ role: m.role as "user" | "assistant", content: m.content, id: m.id.toString() })));
    }
  }, [history]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, isSending]);

  // Reset messages when workspace changes
  const handleSelectWorkspace = (ws: WorkspaceKey) => {
    setSelectedWorkspace(ws);
    setLocalMessages([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("chat.gate.title")}</h2>
          <p className="text-muted-foreground mb-6">{t("chat.gate.body")}</p>
          <a href="/login"><Button className="gradient-purple text-white border-0">{t("chat.gate.cta")}</Button></a>
        </div>
      </div>
    );
  }

  const handleSend = async (text?: string) => {
    if (!selectedWorkspace) return;
    const msgText = text || message.trim();
    if (!msgText || isSending) return;

    const userMsg = { role: "user" as const, content: msgText, id: Date.now().toString() };
    setLocalMessages(prev => [...prev, userMsg]);
    setMessage("");
    setIsSending(true);

    try {
      const response = await sendMessage.mutateAsync({ workspace: selectedWorkspace, message: msgText, language });
      setLocalMessages(prev => [...prev, { role: "assistant", content: response.message, id: (Date.now() + 1).toString() }]);
    } catch {
      setLocalMessages(prev => [...prev, { role: "assistant", content: t("chat.errorReply"), id: (Date.now() + 1).toString() }]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentWs = WORKSPACES.find(w => w.key === selectedWorkspace);
  const currentMeta = selectedWorkspace ? wsMeta(selectedWorkspace) : undefined;

  // Workspace selection screen
  if (!selectedWorkspace) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container py-4 flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> {t("chat.backDashboard")}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-purple flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-foreground">{t("chat.header")}</span>
            </div>
            <LanguageToggle className="ms-auto" />
          </div>
        </div>

        <div className="container py-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-foreground mb-2">{t("chat.chooseTitle")}</h1>
              <p className="text-muted-foreground">{t("chat.chooseSubtitle")}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORKSPACES.map(ws => (
                <button
                  key={ws.key}
                  onClick={() => handleSelectWorkspace(ws.key)}
                  className="workspace-card text-start group"
                >
                  {ws.badge && (
                    <Badge className="absolute top-3 end-3 text-xs gradient-orange text-white border-0">{t("chat.popular")}</Badge>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ws.color} flex items-center justify-center mb-4 shadow-md`}>
                    <ws.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{wsMeta(ws.key).title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{wsMeta(ws.key).desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("chat.open")} <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card flex-shrink-0">
        <div className="container py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedWorkspace(null); setLocalMessages([]); }} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> {t("chat.backWorkspaces")}
          </Button>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentWs?.color} flex items-center justify-center`}>
            {currentWs && <currentWs.icon className="w-4 h-4 text-white" />}
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm">{currentMeta?.title}</div>
            <div className="text-xs text-muted-foreground">{currentMeta?.desc}</div>
          </div>
          <LanguageToggle className="ms-auto" />
          <Badge variant="secondary" className="capitalize">{user?.subscriptionTier || "free"}</Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6 max-w-3xl mx-auto space-y-4">
          {localMessages.length === 0 && (
            <div className="text-center py-10">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentWs?.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                {currentWs && <currentWs.icon className="w-8 h-8 text-white" />}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{currentMeta?.title}</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">{currentMeta?.desc}</p>
              <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                {(SUGGESTED[selectedWorkspace] || []).map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-start px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-secondary/50 transition-all text-sm text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {localMessages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "gradient-purple" : `bg-gradient-to-br ${currentWs?.color}`
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "gradient-purple text-white"
                  : "bg-card border border-border text-foreground"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="streamdown-content text-sm leading-relaxed">
                    <Streamdown>{msg.content}</Streamdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${currentWs?.color} flex items-center justify-center`}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card flex-shrink-0">
        <div className="container py-4 max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chat.inputPlaceholder", { workspace: currentMeta?.title ?? "" })}
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none min-h-[48px] max-h-32"
              style={{ height: "auto" }}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!message.trim() || isSending}
              className="gradient-purple text-white border-0 h-12 w-12 p-0 rounded-xl flex-shrink-0"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {t("chat.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
