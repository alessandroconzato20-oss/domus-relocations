import { useState } from "react";
import { Menu, LogOut, User, Home, FileText, Calendar, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DocumentsCard from "@/components/FamilyDashboard/DocumentsCard";
import AppointmentsCard from "@/components/FamilyDashboard/AppointmentsCard";
import ProfileCard from "@/components/FamilyDashboard/ProfileCard";
import PriorityActionsCard from "@/components/FamilyDashboard/PriorityActionsCard";
import SchoolShortlistCard from "@/components/FamilyDashboard/SchoolShortlistCard";

export default function FamilyDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF8F4]">
        <p className="text-[#8A8880]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAF8F4]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-56" : "w-20"} bg-white border-r border-[#E3DED5] flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Logo */}
        <div className="p-6 border-b border-[#E3DED5]">
          <div className="text-xl font-serif text-[#1C1C1A]">
            {sidebarOpen ? "DOMUS" : "D"}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-[#8A8880] uppercase tracking-widest px-4 py-2 mb-4">
            {sidebarOpen ? "My Relocation" : ""}
          </div>
          
          <NavItem icon={<Home className="w-5 h-5" />} label="Overview" active />
          <NavItem icon={<FileText className="w-5 h-5" />} label="My checklist" />
          <NavItem icon={<Home className="w-5 h-5" />} label="Housing" />
          <NavItem icon={<User className="w-5 h-5" />} label="Schools" />
          <NavItem icon={<FileText className="w-5 h-5" />} label="Flat tax tracker" />

          <div className="text-xs font-semibold text-[#8A8880] uppercase tracking-widest px-4 py-2 mt-6 mb-4">
            {sidebarOpen ? "Resources" : ""}
          </div>

          <NavItem icon={<FileText className="w-5 h-5" />} label="My documents" />
          <NavItem icon={<User className="w-5 h-5" />} label="Trusted network" />
          <NavItem icon={<FileText className="w-5 h-5" />} label="Milan guides" />

          <div className="text-xs font-semibold text-[#8A8880] uppercase tracking-widest px-4 py-2 mt-6 mb-4">
            {sidebarOpen ? "Support" : ""}
          </div>

          <NavItem icon={<MessageSquare className="w-5 h-5" />} label="Messages" badge="3" />
          <NavItem icon={<Calendar className="w-5 h-5" />} label="My appointments" />
          <NavItem icon={<User className="w-5 h-5" />} label="My profile" />
        </nav>

        {/* User profile at bottom */}
        <div className="p-4 border-t border-[#E3DED5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A96E] text-white flex items-center justify-center flex-shrink-0 font-serif font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1C1C1A] truncate">{user.name}</p>
                <p className="text-xs text-[#8A8880] truncate">Premium</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full mt-3 text-xs text-[#C9A96E] hover:text-[#1C1C1A]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {sidebarOpen ? "Logout" : ""}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={`${sidebarOpen ? "ml-56" : "ml-20"} flex-1 overflow-auto transition-all duration-300`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E3DED5] p-6 flex items-center justify-between z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#F0EDE6] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-[#1C1C1A]" />
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F0EDE6] rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-[#1C1C1A]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl italic text-[#1C1C1A] mb-2">Welcome back, the Rossis.</h1>
            <p className="text-sm text-[#8A8880]">Your Milan relocation is underway, here is where things stand today.</p>
            <p className="text-xs text-[#8A8880] mt-2">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <PriorityActionsCard />
            <SchoolShortlistCard />
            <DocumentsCard />
          </div>

          {/* Messages and Appointments */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white border border-[#E3DED5] rounded-lg p-6 col-span-1">
              <h3 className="font-serif text-lg text-[#1C1C1A] mb-4">Messages from DOMUS</h3>
              <p className="text-sm text-[#8A8880]">Coming soon</p>
            </div>

            <AppointmentsCard />
          </div>

          {/* Profile card */}
          <div className="grid grid-cols-3 gap-6">
            <ProfileCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${active ? "bg-[#F0EDE6] text-[#1C1C1A]" : "text-[#8A8880] hover:bg-[#F0EDE6]"}`}>
      {icon}
      <span className="text-sm">{label}</span>
      {badge && <span className="ml-auto text-xs bg-[#C9A96E] text-white px-2 py-1 rounded-full">{badge}</span>}
    </button>
  );
}
