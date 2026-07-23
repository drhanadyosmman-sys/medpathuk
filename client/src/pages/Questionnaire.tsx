import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Loader2,
  Microscope,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

type FormData = {
  specialty: string;
  careerLevel: string;
  country: string;
  targetSpecialty: string;
  targetPathway: string;
  englishStatus: string;
  oetStatus: string;
  researchCount: number;
  auditCount: number;
  qipCount: number;
  teachingExperience: boolean;
  leadershipExperience: boolean;
  presentationsCount: number;
  currentExams: string[];
  examsPassed: string[];
  mainGoal: string;
  availableHoursPerWeek: number;
  goalTimelineMonths: number;
  additionalInfo: string;
};

const SPECIALTIES = ["Internal Medicine", "Surgery", "Paediatrics", "Obstetrics & Gynaecology", "Psychiatry", "Emergency Medicine", "Anaesthetics", "Radiology", "Pathology", "General Practice", "Ophthalmology", "ENT", "Orthopaedics", "Neurology", "Cardiology", "Gastroenterology", "Other"];
const CAREER_LEVELS = ["Medical Student", "Foundation Year 1 (FY1)", "Foundation Year 2 (FY2)", "Core Medical Training (CMT)", "Core Surgical Training (CST)", "Specialty Registrar (ST3+)", "Consultant", "Other"];
const PATHWAYS = ["Foundation Programme", "Core Training", "Specialty Training (Run-through)", "Specialty Training (Uncoupled)", "GP Training", "Academic Clinical Fellowship", "Other"];
const ENGLISH_STATUSES = ["Native English Speaker", "OET Passed", "IELTS Passed", "Currently Preparing", "Not Started Yet"];
const OET_STATUSES = ["Not Applicable", "Not Started", "Currently Preparing", "Booked Exam", "Passed (All Bands)", "Passed (Some Bands)"];
const EXAMS = ["PLAB 1", "PLAB 2", "MRCP Part 1", "MRCP Part 2 Written", "MRCP PACES", "MRCS Part A", "MRCS Part B (OSCE)", "MRCGP AKT", "MRCGP CSA/RCA", "FRCA Primary", "FRCR Part 1", "Other"];
const GOALS = ["Secure a Foundation Programme post", "Enter Core Training", "Enter Specialty Training", "Become a GP", "Pursue Academic Medicine", "Build a strong portfolio", "Pass Royal College exams", "Improve my CV for applications"];

const STEPS = [
  { id: 0, title: "Your Background", icon: Stethoscope, desc: "Tell us about your current position" },
  { id: 1, title: "English & Pathway", icon: BookOpen, desc: "Language status and target pathway" },
  { id: 2, title: "Portfolio Status", icon: ClipboardList, desc: "Your current academic achievements" },
  { id: 3, title: "Exams & Qualifications", icon: GraduationCap, desc: "Examinations completed and in progress" },
  { id: 4, title: "Goals & Timeline", icon: Target, desc: "What you want to achieve and when" },
];

function SelectButton({ value, selected, onClick, children }: { value: string; selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm border transition-all text-start ${
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-border text-foreground hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  );
}

function NumberInput({ value, onChange, label, min = 0, max = 50 }: { value: number; onChange: (v: number) => void; label: string; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary text-foreground">−</button>
        <span className="w-8 text-center font-semibold text-foreground">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary text-foreground">+</button>
      </div>
    </div>
  );
}

export default function Questionnaire() {
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    specialty: "",
    careerLevel: "",
    country: "",
    targetSpecialty: "",
    targetPathway: "",
    englishStatus: "",
    oetStatus: "",
    researchCount: 0,
    auditCount: 0,
    qipCount: 0,
    teachingExperience: false,
    leadershipExperience: false,
    presentationsCount: 0,
    currentExams: [],
    examsPassed: [],
    mainGoal: "",
    availableHoursPerWeek: 10,
    goalTimelineMonths: 12,
    additionalInfo: "",
  });

  const submitAssessment = trpc.onboarding.submit.useMutation();
  const generateRoadmap = trpc.roadmap.generate.useMutation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/activate");
    return null;
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  const toggleExam = (exam: string, field: "currentExams" | "examsPassed") => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(exam) ? prev[field].filter(e => e !== exam) : [...prev[field], exam],
    }));
  };

  const isStepValid = () => {
    if (step === 0) return formData.specialty && formData.careerLevel;
    if (step === 4) return formData.mainGoal;
    return true;
  };

  const handleSubmit = async () => {
    try {
      const result = await submitAssessment.mutateAsync(formData);
      toast.success(t("questionnaire.toasts.saved"));

      await generateRoadmap.mutateAsync({ assessmentId: result.assessmentId });
      toast.success(t("questionnaire.toasts.ready"));
      navigate("/roadmap");
    } catch (error: any) {
      toast.error(error?.message || t("questionnaire.toasts.error"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-purple flex items-center justify-center">
                <Stethoscope className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-foreground">MedPath UK</span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Badge variant="secondary">
                {t("questionnaire.stepBadge", { current: step + 1, total: STEPS.length })}
              </Badge>
            </div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-purple rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container py-10 max-w-2xl mx-auto">
        {/* Step header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "gradient-purple text-white" :
                  "bg-secondary text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-4">{t(`questionnaire.steps.${step}.title`)}</h1>
          <p className="text-muted-foreground">{t(`questionnaire.steps.${step}.desc`)}</p>
        </div>

        {/* Step 0: Background */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">{t("questionnaire.fields.currentSpecialty")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SPECIALTIES.map(s => (
                  <SelectButton key={s} value={s} selected={formData.specialty === s} onClick={() => setFormData(p => ({ ...p, specialty: s }))}>
                    {t(`questionnaire.specialties.${s}`)}
                  </SelectButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">{t("questionnaire.fields.currentCareerLevel")}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CAREER_LEVELS.map(l => (
                  <SelectButton key={l} value={l} selected={formData.careerLevel === l} onClick={() => setFormData(p => ({ ...p, careerLevel: l }))}>
                    {t(`questionnaire.careerLevels.${l}`)}
                  </SelectButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("questionnaire.fields.countryOfOrigin")}</label>
              <input
                type="text"
                value={formData.country}
                onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                placeholder={t("questionnaire.fields.countryPlaceholder")}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        )}

        {/* Step 1: English & Pathway */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">{t("questionnaire.fields.englishStatus")}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ENGLISH_STATUSES.map(s => (
                  <SelectButton key={s} value={s} selected={formData.englishStatus === s} onClick={() => setFormData(p => ({ ...p, englishStatus: s }))}>
                    {t(`questionnaire.englishStatuses.${s}`)}
                  </SelectButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">{t("questionnaire.fields.oetStatus")}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OET_STATUSES.map(s => (
                  <SelectButton key={s} value={s} selected={formData.oetStatus === s} onClick={() => setFormData(p => ({ ...p, oetStatus: s }))}>
                    {t(`questionnaire.oetStatuses.${s}`)}
                  </SelectButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">{t("questionnaire.fields.targetPathway")}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PATHWAYS.map(p => (
                  <SelectButton key={p} value={p} selected={formData.targetPathway === p} onClick={() => setFormData(prev => ({ ...prev, targetPathway: p }))}>
                    {t(`questionnaire.pathways.${p}`)}
                  </SelectButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("questionnaire.fields.targetSpecialty")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SPECIALTIES.map(s => (
                  <SelectButton key={s} value={s} selected={formData.targetSpecialty === s} onClick={() => setFormData(p => ({ ...p, targetSpecialty: s }))}>
                    {t(`questionnaire.specialties.${s}`)}
                  </SelectButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Portfolio */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-secondary/50 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-foreground">{t("questionnaire.fields.academicPortfolio")}</h3>
              <NumberInput value={formData.researchCount} onChange={v => setFormData(p => ({ ...p, researchCount: v }))} label={t("questionnaire.fields.researchPapers")} />
              <NumberInput value={formData.auditCount} onChange={v => setFormData(p => ({ ...p, auditCount: v }))} label={t("questionnaire.fields.clinicalAudits")} />
              <NumberInput value={formData.qipCount} onChange={v => setFormData(p => ({ ...p, qipCount: v }))} label={t("questionnaire.fields.qips")} />
              <NumberInput value={formData.presentationsCount} onChange={v => setFormData(p => ({ ...p, presentationsCount: v }))} label={t("questionnaire.fields.presentations")} />
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">{t("questionnaire.fields.experience")}</h3>
              {[
                { key: "teachingExperience", label: t("questionnaire.fields.teaching"), icon: GraduationCap },
                { key: "leadershipExperience", label: t("questionnaire.fields.leadership"), icon: Users },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, [key]: !p[key as keyof FormData] }))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    formData[key as keyof FormData]
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                  {formData[key as keyof FormData] && <CheckCircle2 className="w-4 h-4 ms-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Exams */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">{t("questionnaire.fields.examsPreparing")}</label>
              <div className="grid grid-cols-2 gap-2">
                {EXAMS.map(e => (
                  <SelectButton key={e} value={e} selected={formData.currentExams.includes(e)} onClick={() => toggleExam(e, "currentExams")}>
                    {t(`questionnaire.exams.${e}`)}
                  </SelectButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">{t("questionnaire.fields.examsPassed")}</label>
              <div className="grid grid-cols-2 gap-2">
                {EXAMS.map(e => (
                  <SelectButton key={e} value={e} selected={formData.examsPassed.includes(e)} onClick={() => toggleExam(e, "examsPassed")}>
                    {t(`questionnaire.exams.${e}`)}
                  </SelectButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Goals */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">{t("questionnaire.fields.primaryGoal")}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOALS.map(g => (
                  <SelectButton key={g} value={g} selected={formData.mainGoal === g} onClick={() => setFormData(p => ({ ...p, mainGoal: g }))}>
                    {t(`questionnaire.goals.${g}`)}
                  </SelectButton>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t("questionnaire.fields.availableHours")} <span className="text-primary">{t("questionnaire.fields.hoursValue", { hours: formData.availableHoursPerWeek })}</span>
                </label>
                <input
                  type="range" min={2} max={40} step={2}
                  value={formData.availableHoursPerWeek}
                  onChange={e => setFormData(p => ({ ...p, availableHoursPerWeek: parseInt(e.target.value) }))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>{t("questionnaire.fields.hoursMin")}</span><span>{t("questionnaire.fields.hoursMax")}</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t("questionnaire.fields.timeline")} <span className="text-primary">{t("questionnaire.fields.monthsValue", { months: formData.goalTimelineMonths })}</span>
                </label>
                <input
                  type="range" min={3} max={36} step={3}
                  value={formData.goalTimelineMonths}
                  onChange={e => setFormData(p => ({ ...p, goalTimelineMonths: parseInt(e.target.value) }))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>{t("questionnaire.fields.monthsMin")}</span><span>{t("questionnaire.fields.monthsMax")}</span></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("questionnaire.fields.additionalInfo")}</label>
              <textarea
                value={formData.additionalInfo}
                onChange={e => setFormData(p => ({ ...p, additionalInfo: e.target.value }))}
                placeholder={t("questionnaire.fields.additionalPlaceholder")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> {t("questionnaire.buttons.back")}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
              className="gradient-purple text-white border-0 gap-2"
            >
              {t("questionnaire.buttons.continue")} <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || submitAssessment.isPending || generateRoadmap.isPending}
              className="gradient-orange text-white border-0 gap-2 px-6"
            >
              {(submitAssessment.isPending || generateRoadmap.isPending) ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {t("questionnaire.buttons.generating")}</>
              ) : (
                <><TrendingUp className="w-4 h-4" /> {t("questionnaire.buttons.generate")}</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
