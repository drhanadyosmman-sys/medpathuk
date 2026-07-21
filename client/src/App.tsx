import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Activate from "./pages/Activate";
import Questionnaire from "./pages/Questionnaire";
import Roadmap from "./pages/Roadmap";
import Resources from "./pages/Resources";
import Chat from "./pages/Chat";
import Links from "./pages/Links";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";
import SASAssessment from "./pages/SASAssessment";
import SASHistory from "./pages/SASHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      <Route path={"/activate"} component={Activate} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/onboarding"} component={Questionnaire} />
      <Route path={"/questionnaire"} component={Questionnaire} />
      <Route path={"/roadmap"} component={Roadmap} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/workspaces"} component={Chat} />
      <Route path={"/chat"} component={Chat} />
      <Route path={"/links"} component={Links} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/sas"} component={SASAssessment} />
      <Route path={"/self-assessment"} component={SASAssessment} />
      <Route path={"/sas/history"} component={SASHistory} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
