import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, MessageCircle } from "lucide-react";
import FamilyDashboardGreeting from "@/components/FamilyDashboard/FamilyDashboardGreeting";
import PriorityActionsCard from "@/components/FamilyDashboard/PriorityActionsCard";
import SchoolShortlistCard from "@/components/FamilyDashboard/SchoolShortlistCard";
import MessagesCard from "@/components/FamilyDashboard/MessagesCard";
import DocumentsCard from "@/components/FamilyDashboard/DocumentsCard";
import AppointmentsCard from "@/components/FamilyDashboard/AppointmentsCard";

export default function FamilyDashboard() {
  const { user, logout, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF8F4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A96E] mx-auto mb-4"></div>
          <p className="text-[#8A8880]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="flex h-screen bg-[#FAF8F4]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-[220px] bg-white border-r border-[#E3DED5] transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8">
            <p className="text-sm font-light tracking-widest text-[#1C1C1A]">DOMUS</p>
            <p className="text-xs text-[#8A8880]">RELOCATIONS MILANO</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-8">
            {/* My Relocation */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#8A8880] mb-3 uppercase">My Relocation</p>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection("overview")}
                    className={`w-full text-left text-sm py-2 px-3 rounded-[10px] transition-colors ${
                      activeSection === "overview"
                        ? "bg-[#F0EDE6] text-[#1C1C1A]"
                        : "text-[#8A8880] hover:bg-[#F5EFE3]"
                    }`}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("checklist")}
                    className={`w-full text-left text-sm py-2 px-3 rounded-[10px] transition-colors ${
                      activeSection === "checklist"
                        ? "bg-[#F0EDE6] text-[#1C1C1A]"
                        : "text-[#8A8880] hover:bg-[#F5EFE3]"
                    }`}
                  >
                    My Checklist
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("housing")}
                    className={`w-full text-left text-sm py-2 px-3 rounded-[10px] transition-colors ${
                      activeSection === "housing"
                        ? "bg-[#F0EDE6] text-[#1C1C1A]"
                        : "text-[#8A8880] hover:bg-[#F5EFE3]"
                    }`}
                  >
                    Housing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("schools")}
                    className={`w-full text-left text-sm py-2 px-3 rounded-[10px] transition-colors ${
                      activeSection === "schools"
                        ? "bg-[#F0EDE6] text-[#1C1C1A]"
                        : "text-[#8A8880] hover:bg-[#F5EFE3]"
                    }`}
                  >
                    Schools
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#8A8880] mb-3 uppercase">Resources</p>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection("documents")}
                    className={`w-full text-left text-sm py-2 px-3 rounded-[10px] transition-colors ${
                      activeSection === "documents"
                        ? "bg-[#F0EDE6] text-[#1C1C1A]"
                        : "text-[#8A8880] hover:bg-[#F5EFE3]"
                    }`}
                  >
                    My Documents
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("guides")}
                    className={`w-full text-left text-sm py-2 px-3 rounded-[10px] transition-colors ${
                      activeSection === "guides"
                        ? "bg-[#F0EDE6] text-[#1C1C1A]"
                        : "text-[#8A8880] hover:bg-[#F5EFE3]"
                    }`}
                  >
                    Milan Guides
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#8A8880] mb-3 uppercase">Support</p>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection("messages")}
                    className={`w-full text-left text-sm py-2 px-3 rounded-[10px] transition-colors flex items-center justify-between ${
                      activeSection === "messages"
                        ? "bg-[#F0EDE6] text-[#1C1C1A]"
                        : "text-[#8A8880] hover:bg-[#F5EFE3]"
                    }`}
                  >
                    Messages
                    <span className="bg-[#C9A96E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("appointments")}
                    className={`w-full text-left text-sm py-2 px-3 rounded-[10px] transition-colors ${
                      activeSection === "appointments"
                        ? "bg-[#F0EDE6] text-[#1C1C1A]"
                        : "text-[#8A8880] hover:bg-[#F5EFE3]"
                    }`}
                  >
                    My Appointments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("profile")}
                    className={`w-full text-left text-sm py-2 px-3 rounded-[10px] transition-colors ${
                      activeSection === "profile"
                        ? "bg-[#F0EDE6] text-[#1C1C1A]"
                        : "text-[#8A8880] hover:bg-[#F5EFE3]"
                    }`}
                  >
                    My Profile
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-[#E3DED5] pt-4">
            <div className="mb-4 pb-4 border-b border-[#E3DED5]">
              <div className="w-10 h-10 rounded-full bg-[#C9A96E] flex items-center justify-center text-white text-sm font-semibold mb-2">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <p className="text-sm font-medium text-[#1C1C1A]">{user.name || "Family"}</p>
              <p className="text-xs text-[#8A8880]">Standard Service</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full text-sm border-[#E3DED5] text-[#8A8880] hover:bg-[#F5EFE3]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 bg-white border-b border-[#E3DED5] px-6 py-4 flex items-center justify-between md:hidden">
          <p className="text-sm font-light text-[#1C1C1A]">DOMUS Dashboard</p>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#8A8880] hover:text-[#1C1C1A]"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          {activeSection === "overview" && (
            <>
              <FamilyDashboardGreeting userName={user.name || "Family"} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2">
                  <PriorityActionsCard />
                </div>
                <div>
                  <SchoolShortlistCard />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <MessagesCard />
                <DocumentsCard />
              </div>
              <div className="mt-6">
                <AppointmentsCard />
              </div>
            </>
          )}

          {activeSection === "messages" && (
            <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
              <h2 className="text-2xl font-serif text-[#1C1C1A] mb-6">Messages from DOMUS</h2>
              <MessagesCard showAll={true} />
            </div>
          )}

          {activeSection === "documents" && (
            <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
              <h2 className="text-2xl font-serif text-[#1C1C1A] mb-6">My Documents</h2>
              <DocumentsCard showAll={true} />
            </div>
          )}

          {activeSection === "appointments" && (
            <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
              <h2 className="text-2xl font-serif text-[#1C1C1A] mb-6">My Appointments</h2>
              <AppointmentsCard showAll={true} />
            </div>
          )}

          {activeSection === "schools" && (
            <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
              <h2 className="text-2xl font-serif text-[#1C1C1A] mb-6">School Shortlist</h2>
              <SchoolShortlistCard showAll={true} />
            </div>
          )}

          {activeSection === "checklist" && (
            <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
              <h2 className="text-2xl font-serif text-[#1C1C1A] mb-6">My Checklist</h2>
              <PriorityActionsCard showAll={true} />
            </div>
          )}

          {["housing", "guides", "profile"].includes(activeSection) && (
            <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6 text-center py-12">
              <p className="text-[#8A8880] text-lg">Coming soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
