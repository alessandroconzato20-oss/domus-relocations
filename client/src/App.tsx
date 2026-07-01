/*
 * DOMUS Relocations — App Root
 * Design: Milanese Atelier — light theme (ivory background)
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// ── Static page imports ────────────────────────────────────────────────────
// Public
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Client dashboard
import DashboardOverview from "./pages/dashboard/Overview";
import DashboardChecklist from "./pages/dashboard/Checklist";
import DashboardDocuments from "./pages/dashboard/Documents";
import DashboardAppointments from "./pages/dashboard/Appointments";
import DashboardSchools from "./pages/dashboard/Schools";
import DashboardMessages from "./pages/dashboard/Messages";
import TrustedNetwork from "./pages/TrustedNetwork";

// Legacy / misc
import UserDashboard from "./pages/UserDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import Setup2FA from "./pages/Setup2FA";
import PartnerDetail from "./pages/PartnerDetail";

// Intake
import Intake from "./pages/Intake";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminClientList from "./pages/admin/ClientList";
import AdminClientDetail from "./pages/admin/ClientDetail";
import AdminIntakeForms from "./pages/admin/IntakeForms";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Public */}
      <Route path={"/"} component={Home} />
      <Route path={"/intake"} component={Intake} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />

      {/* Account */}
      <Route path={"/account"} component={UserDashboard} />

      {/* Client Dashboard */}
      <Route path={"/dashboard"} component={DashboardOverview} />
      <Route path={"/dashboard/checklist"} component={DashboardChecklist} />
      <Route path={"/dashboard/documents"} component={DashboardDocuments} />
      <Route path={"/dashboard/appointments"} component={DashboardAppointments} />
      <Route path={"/dashboard/schools"} component={DashboardSchools} />
      <Route path={"/dashboard/messages"} component={DashboardMessages} />
      <Route path={"/dashboard/network"} component={TrustedNetwork} />

      {/* Legacy */}
      <Route path={"/family-dashboard"} component={FamilyDashboard} />

      {/* Admin */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/clients"} component={AdminClientList} />
      <Route path={"/admin/clients/:id"} component={AdminClientDetail} />
      <Route path={"/admin/intake"} component={AdminIntakeForms} />

      {/* Other */}
      <Route path={"/setup-2fa"} component={Setup2FA} />
      <Route path={"/partner/:id"} component={PartnerDetail} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), then change color palette in index.css
// - If you want to make theme switchable, pass `switchable` to ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
