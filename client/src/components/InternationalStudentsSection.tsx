import { AlertTriangle, FileText, MapPin, Users, CreditCard, Search, Shield, Key, Globe } from 'lucide-react';

export default function InternationalStudentsSection() {
  const challenges = [
    {
      title: 'The contract trap',
      description: 'Italian landlords routinely insert clauses that international students, unfamiliar with local law, sign without understanding. Automatic renewal locks, disproportionate damage clauses, illegal sub-letting bans, and hidden fee structures. Students discover these problems months or years into their tenancy.',
      icon: AlertTriangle,
      color: '#DC2626',
    },
    {
      title: 'The visa maze',
      description: 'Italy\'s student visa process is complex, document-heavy, and poorly explained. Many international students arrive on tourist visas assuming they can convert; they cannot. Permesso di soggiorno delays, missing codice fiscale, and wrong document chains derail starts before they begin.',
      icon: FileText,
      color: '#D97706',
    },
    {
      title: 'The neighbourhood lottery',
      description: 'Without local knowledge, students end up in the wrong area. Too far from campus, unsafe at night, poorly connected, or overpriced for what they get. International students pay a premium for ignorance. Landlords know this and price accordingly.',
      icon: MapPin,
      color: '#4F46E5',
    },
    {
      title: 'The isolation problem',
      description: 'Arriving in a new city, in a new country, alone, without a social network is one of the top drivers of student dropout and mental health strain. Integration support in the first weeks transforms the experience, but no one currently provides it systematically.',
      icon: Users,
      color: '#059669',
    },
  ];

  const services = [
    {
      title: 'Visa & permit advisory',
      description: 'Student visa documentation checklist, pre-departure guidance, permesso di soggiorno process, codice fiscale registration, all explained clearly in English.',
      icon: CreditCard,
      color: '#C9A84C',
    },
    {
      title: 'Housing search',
      description: 'Curated listings matched to the student\'s budget, campus proximity and lifestyle. We pre-screen every landlord and every contract before the student signs.',
      icon: Search,
      color: '#C9A84C',
    },
    {
      title: 'Contract review & protection',
      description: 'Every lease reviewed by our team before signing. We flag illegal clauses, explain obligations, negotiate terms, and ensure students are never exploited by local contract traps.',
      icon: Shield,
      color: '#C9A84C',
    },
    {
      title: 'Neighbourhood advisory',
      description: 'Personalised guide to the right area — safe, well-connected, close to campus. We match housing to the student\'s lifestyle, not just their budget.',
      icon: MapPin,
      color: '#C9A84C',
    },
    {
      title: 'Arrival & setup',
      description: 'Bank account opening, SIM card, utility registration, public transport setup, local GP registration, all sorted in the first week so students can focus on their course.',
      icon: Key,
      color: '#C9A84C',
    },
    {
      title: 'City integration',
      description: 'Social orientation, campus community introductions, trusted local contacts for food, health and daily life. Students feel at home within days, not months.',
      icon: Globe,
      color: '#C9A84C',
    },
  ];

  const timeline = [
    {
      phase: 'Pre-arrival',
      timeframe: '3–6 months before',
      color: '#1F2937',
      items: [
        'Student visa document checklist',
        'Embassy appointment preparation',
        'Initial housing brief & search',
        'Neighbourhood recommendation',
        'Budget planning guidance',
      ],
    },
    {
      phase: 'Arrival month',
      timeframe: 'Week 1–4',
      color: '#4F46E5',
      items: [
        'Airport transfer (optional)',
        'Codice fiscale registration',
        'Contract review & sign-off',
        'Key handover & property check',
        'Bank account & SIM setup',
      ],
    },
    {
      phase: 'Settling in',
      timeframe: 'Month 1–3',
      color: '#059669',
      items: [
        'Permesso di soggiorno filing',
        'University enrolment support',
        'GP registration',
        'City orientation session',
        'Community introductions',
      ],
    },
    {
      phase: 'Ongoing',
      timeframe: 'Year 1 and beyond',
      color: '#D97706',
      items: [
        'Lease renewal review',
        'Housing upgrade advisory',
        'Annual permit renewal support',
        'Emergency landlord mediation',
        'Trusted contacts directory',
      ],
    },
  ];

  return (
    <section id="students" className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* The Challenge */}
        <div className="mb-16 md:mb-24 lg:mb-32">
          <div className="mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xs md:text-sm font-semibold tracking-widest text-amber-700 mb-3 md:mb-4 lg:mb-6">
              THE CHALLENGE YOUR INTERNATIONAL STUDENTS FACE
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif italic text-gray-900 max-w-4xl leading-tight">
              Brilliant students. Completely unprepared for what Italy throws at them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-8">
            {challenges.map((challenge, idx) => {
              const Icon = challenge.icon;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    style={{ backgroundColor: challenge.color }}
                    className="h-1"
                  />
                  <div className="p-4 md:p-5 lg:p-8">
                    <div className="mb-3 md:mb-4 flex items-center justify-center w-10 md:w-11 lg:w-12 h-10 md:h-11 lg:h-12 rounded-full" style={{ backgroundColor: `${challenge.color}20` }}>
                      <Icon size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" style={{ color: challenge.color }} />
                    </div>
                    <h3 className="text-base md:text-lg lg:text-xl font-serif font-bold text-gray-900 mb-2 md:mb-3 lg:mb-4">
                      {challenge.title}
                    </h3>
                    <p className="text-xs md:text-sm lg:text-base text-gray-700 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What DOMUS Does */}
        <div className="mb-16 md:mb-24 lg:mb-32">
          <div className="mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xs md:text-sm font-semibold tracking-widest text-amber-700 mb-3 md:mb-4 lg:mb-6">
              WHAT DOMUS DOES FOR YOUR STUDENTS
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif italic text-gray-900 max-w-4xl leading-tight">
              A complete arrival and settlement service, from visa application to first day of class.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    style={{ backgroundColor: service.color }}
                    className="h-1"
                  />
                  <div className="p-4 md:p-5 lg:p-8">
                    <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                      <Icon size={22} className="md:w-6 md:h-6 lg:w-7 lg:h-7 flex-shrink-0 mt-0.5" style={{ color: service.color }} />
                      <h3 className="text-base md:text-lg lg:text-xl font-serif font-bold text-gray-900">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm lg:text-base text-gray-700 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Student Journey */}
        <div>
          <div className="mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xs md:text-sm font-semibold tracking-widest text-amber-700 mb-3 md:mb-4 lg:mb-6">
              THE DOMUS STUDENT JOURNEY FROM ACCEPTANCE TO SETTLED
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif italic text-gray-900 max-w-4xl leading-tight">
              Everything a student needs, in the right order, before problems arise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-8">
            {timeline.map((phase, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div
                  style={{ backgroundColor: phase.color }}
                  className="h-1"
                />
                <div className="p-4 md:p-5 lg:p-8">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-serif font-bold text-gray-900 mb-1 md:mb-2">
                    {phase.phase}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 italic mb-4 md:mb-5 lg:mb-6">
                    {phase.timeframe}
                  </p>
                  <ul className="space-y-2 md:space-y-2.5 lg:space-y-3">
                    {phase.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 md:gap-2.5">
                        <div
                          style={{ backgroundColor: phase.color }}
                          className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full mt-1.5 md:mt-2 flex-shrink-0"
                        />
                        <span className="text-xs md:text-sm lg:text-base text-gray-700 leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
