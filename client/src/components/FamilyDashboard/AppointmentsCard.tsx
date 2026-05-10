import { Calendar, MapPin, Clock } from "lucide-react";

interface Appointment {
  id: number;
  title: string;
  description?: string;
  appointmentDate: string;
  location?: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface AppointmentsCardProps {
  showAll?: boolean;
}

// Mock data for now
const mockAppointments: Appointment[] = [
  {
    id: 1,
    title: "Apartment viewing — Brera",
    description: "Via Brera 12, Milano",
    appointmentDate: "May 15, 2026 at 2:00 PM",
    location: "Via Brera 12, Milano",
    status: "scheduled",
  },
  {
    id: 2,
    title: "ISM School tour",
    description: "International School of Milan",
    appointmentDate: "May 16, 2026 at 10:00 AM",
    location: "International School of Milan",
    status: "scheduled",
  },
  {
    id: 3,
    title: "Visa appointment",
    description: "Italian Consulate",
    appointmentDate: "May 20, 2026 at 3:30 PM",
    location: "Italian Consulate, Milano",
    status: "scheduled",
  },
];

const statusColors: Record<string, string> = {
  scheduled: "bg-[#E3F2FD] text-[#1976D2]",
  completed: "bg-[#E8F5E9] text-[#388E3C]",
  cancelled: "bg-[#FFEBEE] text-[#C62828]",
};

export default function AppointmentsCard({ showAll = false }: AppointmentsCardProps) {
  const displayAppointments = showAll ? mockAppointments : mockAppointments.slice(0, 3);

  return (
    <div className="bg-white rounded-[12px] border border-[#E3DED5] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-[#C9A96E]" />
        <h3 className="text-lg font-serif text-[#1C1C1A]">
          {showAll ? "All appointments" : "Upcoming appointments"}
        </h3>
      </div>

      <div className="space-y-4">
        {displayAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="p-4 rounded-[10px] bg-[#FAFAF8] hover:bg-[#F5EFE3] transition-colors border border-[#F0EDE6]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-medium text-[#1C1C1A]">{appointment.title}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-[20px] ${
                      statusColors[appointment.status] || "bg-[#F0EDE6] text-[#8A8880]"
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>

                {appointment.description && (
                  <p className="text-xs text-[#8A8880] mb-3">{appointment.description}</p>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-[#8A8880]">
                    <Clock className="w-4 h-4" />
                    {appointment.appointmentDate}
                  </div>
                  {appointment.location && (
                    <div className="flex items-center gap-2 text-xs text-[#8A8880]">
                      <MapPin className="w-4 h-4" />
                      {appointment.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && mockAppointments.length > 3 && (
        <button className="mt-4 text-sm text-[#C9A96E] hover:text-[#8A8880] transition-colors">
          View all appointments
        </button>
      )}

      {displayAppointments.length === 0 && (
        <p className="text-sm text-[#8A8880] text-center py-8">
          No appointments scheduled yet
        </p>
      )}
    </div>
  );
}
