interface School {
  id: number;
  schoolInitials: string;
  schoolName: string;
  curriculumType: string;
  ageRange: string;
  status: "Applied" | "Visit booked" | "Reviewed" | "Offer received" | "Accepted";
}

interface SchoolShortlistCardProps {
  showAll?: boolean;
}

// Mock data for now
const mockSchools: School[] = [
  {
    id: 1,
    schoolInitials: "ISM",
    schoolName: "International School of Milan",
    curriculumType: "IB",
    ageRange: "3-18 years",
    status: "Reviewed",
  },
  {
    id: 2,
    schoolInitials: "SJB",
    schoolName: "St. James Bilingual",
    curriculumType: "Cambridge",
    ageRange: "3-13 years",
    status: "Visit booked",
  },
  {
    id: 3,
    schoolInitials: "LSM",
    schoolName: "Lycée Stendhal Milano",
    curriculumType: "French",
    ageRange: "3-18 years",
    status: "Applied",
  },
  {
    id: 4,
    schoolInitials: "ASM",
    schoolName: "American School of Milan",
    curriculumType: "American",
    ageRange: "3-18 years",
    status: "Offer received",
  },
];

const statusColors: Record<string, string> = {
  Applied: "bg-[#FFF3E0] text-[#F57C00]",
  "Visit booked": "bg-[#E3F2FD] text-[#1976D2]",
  Reviewed: "bg-[#F3E5F5] text-[#7B1FA2]",
  "Offer received": "bg-[#E8F5E9] text-[#388E3C]",
  Accepted: "bg-[#C8E6C9] text-[#1B5E20]",
};

export default function SchoolShortlistCard({ showAll = false }: SchoolShortlistCardProps) {
  const displaySchools = showAll ? mockSchools : mockSchools.slice(0, 4);

  return (
    <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
      <h3 className="text-lg font-serif text-[#1C1C1A] mb-6">School shortlist</h3>

      <div className="space-y-3">
        {displaySchools.map((school) => (
          <div
            key={school.id}
            className="flex items-center gap-4 p-3 rounded-[10px] bg-[#FAFAF8] hover:bg-[#F5EFE3] transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-[50%] bg-[#C9A96E] flex items-center justify-center text-white text-xs font-semibold">
              {school.schoolInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C1C1A] truncate">
                {school.schoolName}
              </p>
              <p className="text-xs text-[#8A8880]">
                {school.curriculumType} • {school.ageRange}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span
                className={`text-xs px-2 py-1 rounded-[20px] whitespace-nowrap ${
                  statusColors[school.status] || "bg-[#F0EDE6] text-[#8A8880]"
                }`}
              >
                {school.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!showAll && mockSchools.length > 4 && (
        <button className="mt-4 text-sm text-[#C9A96E] hover:text-[#8A8880] transition-colors">
          View all schools
        </button>
      )}
    </div>
  );
}
