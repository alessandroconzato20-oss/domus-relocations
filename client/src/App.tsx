/*
 * DOMUS Relocations — App Root
 * Design: Milanese Atelier — light theme (ivory background)
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserDashboard from "./pages/UserDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import TrustedNetwork from "./pages/TrustedNetwork";
import Setup2FA from "./pages/Setup2FA";
import PartnerDetail from "./pages/PartnerDetail";

// New client dashboard pages
import DashboardOverview from "./pages/dashboard/Overview";
import DashboardChecklist from "./pages/dashboard/Checklist";
import DashboardDocuments from "./pages/dashboard/Documents";
import DashboardAppointments from "./pages/dashboard/Appointments";
import DashboardSchools from "./pages/dashboard/Schools";
import DashboardMessages from "./pages/dashboard/Messages";

// New admin client management pages
import AdminClientList from "./pages/admin/ClientList";
import AdminClientDetail from "./pages/admin/ClientDetail";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Public */}
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />

      {/* Account */}
      <Route path={"/account"} component={UserDashboard} />

      {/* Client Dashboard — new section-based routes */}
      <Route path={"/dashboard"} component={DashboardOverview} />
      <Route path={"/dashboard/checklist"} component={DashboardChecklist} />
      <Route path={"/dashboard/documents"} component={DashboardDocuments} />
      <Route path={"/dashboard/appointments"} component={DashboardAppointments} />
      <Route path={"/dashboard/schools"} component={DashboardSchools} />
      <Route path={"/dashboard/messages"} component={DashboardMessages} />
      <Route path={"/dashboard/network"} component={TrustedNetwork} />

      {/* Legacy dashboard routes — redirect to new ones */}
      <Route path={"/family-dashboard"} component={FamilyDashboard} />

      {/* Admin */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/clients"} component={AdminClientList} />
      <Route path={"/admin/clients/:id"} component={AdminClientDetail} />

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
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
