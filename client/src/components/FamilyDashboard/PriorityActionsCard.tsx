import { CheckCircle2, Circle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  category: string;
  dueDate?: string;
  isCompleted: boolean;
}

interface PriorityActionsCardProps {
  showAll?: boolean;
}

// Mock data for now
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Submit visa application documents",
    category: "Legal",
    dueDate: "May 20, 2026",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Review 3 shortlisted apartments",
    category: "Housing",
    dueDate: "May 15, 2026",
    isCompleted: false,
  },
  {
    id: 3,
    title: "Schedule school visits",
    category: "Schools",
    dueDate: "May 18, 2026",
    isCompleted: false,
  },
  {
    id: 4,
    title: "Confirm apartment lease",
    category: "Housing",
    dueDate: "May 25, 2026",
    isCompleted: true,
  },
];

const categoryColors: Record<string, string> = {
  Housing: "bg-[#F5EFE3] text-[#C9A96E]",
  Schools: "bg-[#E8F5E9] text-[#66BB6A]",
  Legal: "bg-[#F3E5F5] text-[#AB47BC]",
  Integration: "bg-[#E3F2FD] text-[#1976D2]",
};

export default function PriorityActionsCard({ showAll = false }: PriorityActionsCardProps) {
  const displayTasks = showAll ? mockTasks : mockTasks.slice(0, 4);

  return (
    <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#C9A96E]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h4a1 1 0 100-2H7z" />
          </svg>
        </div>
        <h3 className="text-lg font-serif text-[#1C1C1A]">Priority actions</h3>
      </div>

      <div className="space-y-3">
        {displayTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-[10px] transition-colors ${
              task.isCompleted ? "bg-[#F5EFE3]" : "bg-[#FAFAF8]"
            }`}
          >
            <div className="flex-shrink-0 mt-1">
              {task.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[#8A8880]" />
              ) : (
                <Circle className="w-5 h-5 text-[#E3DED5]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${
                  task.isCompleted
                    ? "line-through text-[#8A8880]"
                    : "text-[#1C1C1A]"
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-[20px] ${
                    categoryColors[task.category] || "bg-[#F0EDE6] text-[#8A8880]"
                  }`}
                >
                  {task.category}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-[#8A8880]">{task.dueDate}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && mockTasks.length > 4 && (
        <button className="mt-4 text-sm text-[#C9A96E] hover:text-[#8A8880] transition-colors">
          View all tasks
        </button>
      )}
    </div>
  );
}
