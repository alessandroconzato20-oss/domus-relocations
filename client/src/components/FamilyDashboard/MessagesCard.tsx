import { MessageCircle } from "lucide-react";

interface Message {
  id: number;
  senderName: string;
  timestamp: string;
  preview: string;
  isRead: boolean;
}

interface MessagesCardProps {
  showAll?: boolean;
}

// Mock data for now
const mockMessages: Message[] = [
  {
    id: 1,
    senderName: "DOMUS Advisory",
    timestamp: "Today",
    preview: "We've reviewed your apartment options in Brera. Here are our top 3 recommendations...",
    isRead: false,
  },
  {
    id: 2,
    senderName: "James Henderson",
    timestamp: "Yesterday",
    preview: "The school visits have been scheduled for next week. Please confirm your availability...",
    isRead: false,
  },
  {
    id: 3,
    senderName: "DOMUS Advisory",
    timestamp: "Friday",
    preview: "Your visa documentation has been received. We're processing it now...",
    isRead: true,
  },
];

export default function MessagesCard({ showAll = false }: MessagesCardProps) {
  const displayMessages = showAll ? mockMessages : mockMessages.slice(0, 3);

  return (
    <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-[#C9A96E]" />
        <h3 className="text-lg font-serif text-[#1C1C1A]">Messages from DOMUS</h3>
      </div>

      <div className="space-y-3">
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-[10px] transition-colors ${
              message.isRead ? "bg-[#FAFAF8]" : "bg-[#F5EFE3]"
            } hover:bg-[#F0EDE6] cursor-pointer`}
          >
            <div className="flex items-start gap-2">
              {!message.isRead && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#C9A96E] mt-2"></div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-medium ${
                    message.isRead ? "text-[#8A8880]" : "text-[#1C1C1A]"
                  }`}>
                    {message.senderName}
                  </p>
                  <p className="text-xs text-[#8A8880] flex-shrink-0">{message.timestamp}</p>
                </div>
                <p className="text-sm text-[#8A8880] mt-1 line-clamp-2">
                  {message.preview}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && mockMessages.length > 3 && (
        <button className="mt-4 text-sm text-[#C9A96E] hover:text-[#8A8880] transition-colors">
          View all messages
        </button>
      )}
    </div>
  );
}
