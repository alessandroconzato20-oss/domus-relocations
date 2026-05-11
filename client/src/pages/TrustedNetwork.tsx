import { useState } from "react";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

type Category = "Medical" | "Legal & Tax" | "Education" | "Property" | "Lifestyle & Home" | "Social & Community";

const CATEGORIES: Category[] = [
  "Medical",
  "Legal & Tax",
  "Education",
  "Property",
  "Lifestyle & Home",
  "Social & Community",
];

const categoryColors: Record<Category, { bg: string; text: string }> = {
  "Medical": { bg: "#F0E8F5", text: "#8B7BA8" },
  "Legal & Tax": { bg: "#FFF4E6", text: "#D4A574" },
  "Education": { bg: "#E8F0E6", text: "#6B8E6F" },
  "Property": { bg: "#F5EFE3", text: "#C9A96E" },
  "Lifestyle & Home": { bg: "#E8F5F0", text: "#6B8E8A" },
  "Social & Community": { bg: "#F0EDE6", text: "#8A8880" },
};

export default function TrustedNetwork() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const { data: allContacts = [] } = trpc.trustedNetwork.getAll.useQuery();
  const { data: categoryContacts = [] } = trpc.trustedNetwork.getByCategory.useQuery(
    { category: selectedCategory || "" },
    { enabled: !!selectedCategory }
  );

  const contacts = selectedCategory ? categoryContacts : allContacts;

  const handleContactClick = (method: string, value: string) => {
    if (method === "email") {
      window.location.href = `mailto:${value}`;
    } else if (method === "phone") {
      window.location.href = `tel:${value}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 text-[#C9A96E] hover:text-[#1C1C1A] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to dashboard</span>
          </button>
          <h1 className="font-serif text-4xl italic text-[#1C1C1A] mb-2">Trusted Network</h1>
          <p className="text-[#8A8880]">A curated directory of DOMUS-vetted professionals and services</p>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === null
                ? "bg-[#1C1C1A] text-white"
                : "bg-white border border-[#E3DED5] text-[#1C1C1A] hover:bg-[#F0EDE6]"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-[#1C1C1A] text-white"
                  : "bg-white border border-[#E3DED5] text-[#1C1C1A] hover:bg-[#F0EDE6]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Contacts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white border border-[#E3DED5] rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              {/* Category badge */}
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
                style={{
                  backgroundColor: categoryColors[contact.category as Category].bg,
                  color: categoryColors[contact.category as Category].text,
                }}
              >
                {contact.category}
              </div>

              {/* Contact info */}
              <h3 className="font-serif text-lg text-[#1C1C1A] mb-1">{contact.name}</h3>
              <p className="text-sm text-[#8A8880] mb-3">{contact.role}</p>

              {/* Endorsement */}
              <p className="text-sm text-[#1C1C1A] mb-4 italic">&quot;{contact.endorsement}&quot;</p>

              {/* Contact button */}
              <button
                onClick={() => handleContactClick(contact.contactMethod, contact.contactValue)}
                className="w-full flex items-center justify-center gap-2 bg-[#C9A96E] text-white py-2 rounded-lg hover:bg-[#1C1C1A] transition-colors text-sm font-medium"
              >
                {contact.contactMethod === "email" ? (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#8A8880]">No contacts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
