import { CheckCircle2, Circle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: "Housing" | "Schools" | "Legal" | "Integration";
  dueDate?: string;
  completed: boolean;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Submit apartment application",
    category: "Housing",
    dueDate: "May 15",
    completed: false,
  },
  {
    id: "2",
    title: "Review 3 shortlisted schools",
    category: "Schools",
    dueDate: "May 18",
    completed: false,
  },
  {
    id: "3",
    title: "Sign up for Italian language course",
    category: "Integration",
    dueDate: "May 20",
    completed: true,
  },
  {
    id: "4",
    title: "Confirm school visit appointment",
    category: "Schools",
    dueDate: "May 12",
    completed: false,
  },
  {
    id: "5",
    title: "Arrange flat tax appointment",
    category: "Legal",
    completed: false,
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Housing: { bg: "#F5EFE3", text: "#C9A96E" },
  Schools: { bg: "#E8F0E6", text: "#6B8E6F" },
  Legal: { bg: "#F0E8F5", text: "#8B7BA8" },
  Integration: { bg: "#FFF4E6", text: "#D4A574" },
};

export default function PriorityActionsCard() {
  return (
    <div className="bg-white border border-[#E3DED5] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 text-[#C9A96E]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-serif text-lg text-[#1C1C1A]">Priority actions</h3>
      </div>

      <div className="space-y-3">
        {mockTasks.slice(0, 5).map((task) => (
          <div key={task.id} className="flex items-start gap-3 pb-3 border-b border-[#E3DED5] last:border-0 last:pb-0">
            <button className="mt-0.5 flex-shrink-0">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[#8A8880]" />
              ) : (
                <Circle className="w-5 h-5 text-[#E3DED5]" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.completed ? "line-through text-[#8A8880]" : "text-[#1C1C1A]"}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: categoryColors[task.category].bg,
                    color: categoryColors[task.category].text,
                  }}
                >
                  {task.category}
                </span>
                {task.dueDate && <span className="text-xs text-[#8A8880]">{task.dueDate}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 text-sm text-[#C9A96E] hover:text-[#1C1C1A] transition-colors">
        View all tasks
      </button>
    </div>
  );
}
