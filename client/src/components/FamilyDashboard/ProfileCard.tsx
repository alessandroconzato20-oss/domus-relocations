import { Card } from "@/components/ui/card";

interface ProfileData {
  persona: string;
  movingFrom: string;
  timeline: string;
  children: string;
  reason: string;
  serviceTier: string;
}

const mockProfile: ProfileData = {
  persona: "The Executive Family",
  movingFrom: "London, UK",
  timeline: "Q3 2026",
  children: "2 (ages 8, 11)",
  reason: "Relocation for work",
  serviceTier: "Premium",
};

export default function ProfileCard() {
  return (
    <Card className="p-6 bg-white border border-[#E3DED5]">
      <h3 className="text-xs font-semibold tracking-widest text-[#8A8880] uppercase mb-4">My profile</h3>
      
      {/* Persona */}
      <p className="font-serif text-lg italic text-[#1C1C1A] mb-6">{mockProfile.persona}</p>
      
      {/* Profile details table */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
        <div>
          <p className="text-[#8A8880] uppercase tracking-wide text-xs mb-1">Moving from</p>
          <p className="text-[#1C1C1A] font-medium">{mockProfile.movingFrom}</p>
        </div>
        <div>
          <p className="text-[#8A8880] uppercase tracking-wide text-xs mb-1">Timeline</p>
          <p className="text-[#1C1C1A] font-medium">{mockProfile.timeline}</p>
        </div>
        <div>
          <p className="text-[#8A8880] uppercase tracking-wide text-xs mb-1">Children</p>
          <p className="text-[#1C1C1A] font-medium">{mockProfile.children}</p>
        </div>
        <div>
          <p className="text-[#8A8880] uppercase tracking-wide text-xs mb-1">Reason</p>
          <p className="text-[#1C1C1A] font-medium">{mockProfile.reason}</p>
        </div>
      </div>
      
      {/* Service tier */}
      <div className="pb-6 border-b border-[#F0EDE6]">
        <p className="text-[#8A8880] uppercase tracking-wide text-xs mb-1">Service tier</p>
        <p className="text-[#1C1C1A] font-medium">{mockProfile.serviceTier}</p>
      </div>
      
      {/* Advisor section */}
      <div className="mt-6 flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C9A96E] text-white flex-shrink-0">
          <span className="text-xs font-semibold">DA</span>
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-[#1C1C1A]">DOMUS Advisory Team</p>
          <p className="text-xs text-[#8A8880]">Responds within 24h</p>
        </div>
      </div>
      
      {/* Retake quiz link */}
      <button className="mt-4 text-xs text-[#C9A96E] hover:text-[#1C1C1A] transition-colors">
        Retake profile quiz
      </button>
    </Card>
  );
}
