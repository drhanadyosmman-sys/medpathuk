import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Switches the whole site between English and Arabic.
 *
 * Each option is written in its own script rather than translated — someone
 * looking for Arabic is scanning for "العربية", not for the word "Arabic"
 * rendered in a language they may not read. That also means the control works
 * before the reader knows which language the page is currently in.
 */
export default function LanguageToggle({
  className = "",
}: {
  className?: string;
}) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-card/60 p-0.5 ${className}`}
      role="group"
      aria-label={t("common.language.label")}
    >
      <Languages
        className="w-3.5 h-3.5 text-muted-foreground mx-1.5 shrink-0"
        aria-hidden="true"
      />
      {(
        [
          { code: "en", label: "English" },
          { code: "ar", label: "العربية" },
        ] as const
      ).map(option => {
        const active = language === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            aria-pressed={active}
            lang={option.code}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
