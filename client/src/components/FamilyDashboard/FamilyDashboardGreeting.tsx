interface FamilyDashboardGreetingProps {
  userName: string;
}

export default function FamilyDashboardGreeting({ userName }: FamilyDashboardGreetingProps) {
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-serif italic text-[#1C1C1A] mb-2">
        Welcome back, the {userName}.
      </h1>
      <p className="text-sm tracking-widest text-[#8A8880] uppercase mb-4">
        Your Milan relocation is underway, here is where things stand today.
      </p>
      <p className="text-sm text-[#8A8880]">{dateString}</p>
    </div>
  );
}
