import { BookOpen } from "lucide-react";

interface School {
  id: string;
  initials: string;
  name: string;
  curriculum: string;
  ageRange: string;
  status: "Applied" | "Visit booked" | "Reviewed" | "Offer received" | "Accepted";
}

const mockSchools: School[] = [
  {
    id: "1",
    initials: "ISM",
    name: "International School of Milan",
    curriculum: "IB",
    ageRange: "3-18",
    status: "Accepted",
  },
  {
    id: "2",
    initials: "LSM",
    name: "Liceo Scientifico Milano",
    curriculum: "Italian",
    ageRange: "6-18",
    status: "Visit booked",
  },
  {
    id: "3",
    initials: "ASM",
    name: "American School of Milan",
    curriculum: "American",
    ageRange: "K-12",
    status: "Applied",
  },
  {
    id: "4",
    initials: "CSM",
    name: "Collegio San Carlo",
    curriculum: "Italian",
    ageRange: "3-18",
    status: "Reviewed",
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Applied: { bg: "#F5EFE3", text: "#C9A96E" },
  "Visit booked": { bg: "#E8F0E6", text: "#6B8E6F" },
  Reviewed: { bg: "#F0E8F5", text: "#8B7BA8" },
  "Offer received": { bg: "#FFF4E6", text: "#D4A574" },
  Accepted: { bg: "#E8F0E6", text: "#6B8E6F" },
};

export default function SchoolShortlistCard() {
  return (
    <div className="bg-white border border-[#E3DED5] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-[#C9A96E]" />
        <h3 className="font-serif text-lg text-[#1C1C1A]">School shortlist</h3>
      </div>

      <div className="space-y-3">
        {mockSchools.slice(0, 4).map((school) => (
          <div key={school.id} className="flex items-start gap-3 pb-3 border-b border-[#E3DED5] last:border-0 last:pb-0">
            {/* School initials badge */}
            <div className="w-8 h-8 rounded-full bg-[#C9A96E] text-white flex items-center justify-center flex-shrink-0 font-serif text-xs font-semibold">
              {school.initials}
            </div>

            {/* School info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C1C1A]">{school.name}</p>
              <p className="text-xs text-[#8A8880]">
                {school.curriculum} • Ages {school.ageRange}
              </p>
            </div>

            {/* Status pill */}
            <span
              className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap"
              style={{
                backgroundColor: statusColors[school.status].bg,
                color: statusColors[school.status].text,
              }}
            >
              {school.status}
            </span>
          </div>
        ))}
      </div>

      <button className="mt-4 text-sm text-[#C9A96E] hover:text-[#1C1C1A] transition-colors">
        View all schools
      </button>
    </div>
  );
}
