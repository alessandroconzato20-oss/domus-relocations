import { Card } from "@/components/ui/card";

interface Appointment {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  status: "confirmed" | "pending" | "booked";
  isNext: boolean;
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    title: "Apartment viewing - Navigli",
    date: new Date("2026-05-12"),
    time: "10:00 AM",
    location: "Via Torino 45, Milano",
    status: "confirmed",
    isNext: true,
  },
  {
    id: 2,
    title: "School tour - International School",
    date: new Date("2026-05-15"),
    time: "2:00 PM",
    location: "Via Bocconi 7, Milano",
    status: "booked",
    isNext: false,
  },
  {
    id: 3,
    title: "Relocation consultation",
    date: new Date("2026-05-18"),
    time: "3:30 PM",
    location: "DOMUS Office, Via Montenapoleone",
    status: "pending",
    isNext: false,
  },
  {
    id: 4,
    title: "Flat tax registration",
    date: new Date("2026-05-22"),
    time: "11:00 AM",
    location: "Municipality Office",
    status: "pending",
    isNext: false,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "booked":
      return "bg-purple-100 text-purple-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AppointmentsCard() {
  return (
    <Card className="p-6 bg-white border border-[#E3DED5] col-span-2">
      <h3 className="font-serif text-lg text-[#1C1C1A] mb-4">Upcoming appointments</h3>
      
      <div className="space-y-3">
        {mockAppointments.map((apt) => (
          <div key={apt.id} className="flex items-start gap-4 pb-3 border-b border-[#F0EDE6] last:border-b-0">
            {/* Day badge */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${apt.isNext ? "bg-[#C9A96E] text-white" : "bg-[#F0EDE6] text-[#8A8880]"}`}>
              <span className="font-serif text-sm font-semibold">{apt.date.getDate()}</span>
            </div>
            
            {/* Appointment details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C1C1A]">{apt.title}</p>
              <p className="text-xs text-[#8A8880] mt-1">
                {formatDate(apt.date)} at {apt.time} • {apt.location}
              </p>
            </div>
            
            {/* Status pill */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(apt.status)}`}>
              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 text-sm text-[#C9A96E] hover:text-[#1C1C1A] transition-colors">
        View full calendar
      </button>
    </Card>
  );
}
