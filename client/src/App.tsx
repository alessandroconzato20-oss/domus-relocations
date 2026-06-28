/*
 * DOMUS Relocations — App Root
 * Design: Milanese Atelier — light theme (ivory background)
 *
 * All page-level components are loaded via React.lazy so Vite splits them into
 * separate async chunks. This eliminates the "Reduce unused JavaScript" warning
 * by ensuring only the code needed for the current route is parsed on load.
 */

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// ── Lazy-loaded page chunks ────────────────────────────────────────────────
// Public
const Home               = lazy(() => import("./pages/Home"));
const Login              = lazy(() => import("./pages/Login"));
const Signup             = lazy(() => import("./pages/Signup"));
const ForgotPassword     = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword      = lazy(() => import("./pages/ResetPassword"));
const NotFound           = lazy(() => import("./pages/NotFound"));

// Client dashboard
const DashboardOverview      = lazy(() => import("./pages/dashboard/Overview"));
const DashboardChecklist     = lazy(() => import("./pages/dashboard/Checklist"));
const DashboardDocuments     = lazy(() => import("./pages/dashboard/Documents"));
const DashboardAppointments  = lazy(() => import("./pages/dashboard/Appointments"));
const DashboardSchools       = lazy(() => import("./pages/dashboard/Schools"));
const DashboardMessages      = lazy(() => import("./pages/dashboard/Messages"));
const TrustedNetwork         = lazy(() => import("./pages/TrustedNetwork"));

// Legacy / misc
const UserDashboard    = lazy(() => import("./pages/UserDashboard"));
const FamilyDashboard  = lazy(() => import("./pages/FamilyDashboard"));
const Setup2FA         = lazy(() => import("./pages/Setup2FA"));
const PartnerDetail    = lazy(() => import("./pages/PartnerDetail"));

// Admin
const AdminDashboard    = lazy(() => import("./pages/AdminDashboard"));
const AdminClientList   = lazy(() => import("./pages/admin/ClientList"));
const AdminClientDetail = lazy(() => import("./pages/admin/ClientDetail"));

// ── Minimal loading fallback ───────────────────────────────────────────────
// Keeps the ivory background visible while the chunk loads — no layout shift.
function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--domus-ivory, #F5F0E8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          border: "2px solid rgba(201, 168, 76, 0.2)",
          borderTopColor: "#C9A84C",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Public */}
        <Route path={"/"} component={Home} />
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

        {/* Other */}
        <Route path={"/setup-2fa"} component={Setup2FA} />
        <Route path={"/partner/:id"} component={PartnerDetail} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
