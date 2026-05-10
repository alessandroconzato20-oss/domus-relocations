import { FileText, FileJson, File } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Document {
  id: number;
  name: string;
  type: "pdf" | "guide" | "shortlist" | "lease" | "report";
  uploadDate: Date;
  uploadedBy: "domus" | "family";
}

const mockDocuments: Document[] = [
  {
    id: 1,
    name: "Milan Neighborhood Guide 2026",
    type: "guide",
    uploadDate: new Date("2026-05-08"),
    uploadedBy: "domus",
  },
  {
    id: 2,
    name: "Apartment Shortlist - Navigli District",
    type: "shortlist",
    uploadDate: new Date("2026-05-07"),
    uploadedBy: "domus",
  },
  {
    id: 3,
    name: "Lease Draft - Via Torino",
    type: "lease",
    uploadDate: new Date("2026-05-05"),
    uploadedBy: "domus",
  },
  {
    id: 4,
    name: "School Reports - International Schools",
    type: "report",
    uploadDate: new Date("2026-05-03"),
    uploadedBy: "domus",
  },
];

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileText className="w-4 h-4 text-red-500" />;
    case "guide":
      return <FileJson className="w-4 h-4 text-blue-500" />;
    case "shortlist":
      return <File className="w-4 h-4 text-amber-500" />;
    case "lease":
      return <File className="w-4 h-4 text-green-500" />;
    case "report":
      return <File className="w-4 h-4 text-purple-500" />;
    default:
      return <File className="w-4 h-4 text-gray-500" />;
  }
}

export default function DocumentsCard() {
  return (
    <Card className="p-6 bg-white border border-[#E3DED5]">
      <h3 className="font-serif text-lg text-[#1C1C1A] mb-4">My documents</h3>
      
      <div className="space-y-3">
        {mockDocuments.map((doc) => (
          <div key={doc.id} className="flex items-start gap-3 pb-3 border-b border-[#F0EDE6] last:border-b-0">
            <div className="mt-1">{getFileIcon(doc.type)}</div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#1C1C1A] font-medium truncate">{doc.name}</p>
              <p className="text-xs text-[#8A8880] mt-1">
                {doc.uploadDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • Uploaded by {doc.uploadedBy === "domus" ? "DOMUS" : "You"}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 text-sm text-[#C9A96E] hover:text-[#1C1C1A] transition-colors">
        View all documents
      </button>
    </Card>
  );
}
