import { FileText, Download } from "lucide-react";

interface Document {
  id: number;
  title: string;
  description?: string;
  category: string;
}

interface DocumentsCardProps {
  showAll?: boolean;
}

// Mock data for now
const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Full relocation application guide",
    description: "Complete guide for your relocation process",
    category: "Housing",
  },
  {
    id: 2,
    title: "Apartment shortlist — Brera & Navigli",
    description: "Recommended properties in your preferred neighborhoods",
    category: "Housing",
  },
  {
    id: 3,
    title: "School neighborhood/school data",
    description: "Comprehensive school information",
    category: "Schools",
  },
];

const categoryColors: Record<string, string> = {
  Housing: "bg-[#F5EFE3] text-[#C9A96E]",
  Schools: "bg-[#E8F5E9] text-[#66BB6A]",
  Legal: "bg-[#F3E5F5] text-[#AB47BC]",
  Integration: "bg-[#E3F2FD] text-[#1976D2]",
};

export default function DocumentsCard({ showAll = false }: DocumentsCardProps) {
  const displayDocuments = showAll ? mockDocuments : mockDocuments.slice(0, 3);

  return (
    <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-[#C9A96E]" />
        <h3 className="text-lg font-serif text-[#1C1C1A]">My documents</h3>
      </div>

      <div className="space-y-3">
        {displayDocuments.map((doc) => (
          <div
            key={doc.id}
            className="flex items-start gap-3 p-3 rounded-[10px] bg-[#FAFAF8] hover:bg-[#F5EFE3] transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-[10px] bg-[#F0EDE6] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#C9A96E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C1C1A]">{doc.title}</p>
              {doc.description && (
                <p className="text-xs text-[#8A8880] mt-1">{doc.description}</p>
              )}
              <div className="mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-[20px] ${
                    categoryColors[doc.category] || "bg-[#F0EDE6] text-[#8A8880]"
                  }`}
                >
                  {doc.category}
                </span>
              </div>
            </div>
            <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="w-4 h-4 text-[#C9A96E]" />
            </button>
          </div>
        ))}
      </div>

      {!showAll && mockDocuments.length > 3 && (
        <button className="mt-4 text-sm text-[#C9A96E] hover:text-[#8A8880] transition-colors">
          View all documents
        </button>
      )}
    </div>
  );
}
