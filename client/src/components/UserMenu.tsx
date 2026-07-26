import { LogOut, LayoutDashboard, User } from "lucide-react";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/_core/hooks/useAuth";
import { useT } from "@/contexts/LanguageContext";

/**
 * The account button in page headers. It used to be a plain avatar with no
 * behaviour, which left a signed-in doctor with no way to see who they were
 * signed in as or to sign out from any page but the dashboard. Now it opens a
 * menu with the account and a sign-out action, the same everywhere.
 */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const t = useT();

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("common.nav.signOut")}
          className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          {initial || <User className="w-4 h-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {(user?.name || user?.email) && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                {user?.name && <span className="text-sm font-medium truncate">{user.name}</span>}
                {user?.email && <span className="text-xs text-muted-foreground truncate" dir="ltr">{user.email}</span>}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/dashboard")}>
          <LayoutDashboard className="me-2 h-4 w-4" />
          <span>{t("common.nav.dashboard")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={logout}
        >
          <LogOut className="me-2 h-4 w-4" />
          <span>{t("common.nav.signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
