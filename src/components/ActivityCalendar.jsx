import { useMemo } from 'react';

export default function ActivityCalendar({ activities = [], onMonthClick }) {
  const calendarData = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Get first and last day of current month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Build array of all days in the month
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const activity = activities.find(a => a.date === dateStr);

      days.push({
        date: dateStr,
        dayOfWeek: date.getDay(),
        dayOfMonth: day,
        isComplete: activity?.is_complete || false,
        cardsReviewed: activity?.cards_reviewed || 0,
        cardsLearned: activity?.cards_learned || 0,
      });
    }

    // Group days by week (Sunday to Saturday)
    const weeks = [];
    let currentWeek = new Array(7).fill(null);

    // Add empty cells for days before the 1st of the month
    const firstDayOfWeek = firstDay.getDay();

    days.forEach(day => {
      const position = (day.dayOfMonth - 1 + firstDayOfWeek) % 7;
      const weekIndex = Math.floor((day.dayOfMonth - 1 + firstDayOfWeek) / 7);

      if (!weeks[weekIndex]) {
        weeks[weekIndex] = new Array(7).fill(null);
      }

      weeks[weekIndex][position] = day;
    });

    return { weeks, monthName: firstDay.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) };
  }, [activities]);

  // Calculate monthly achievements
  const monthlyStats = useMemo(() => {
    const months = {};

    activities.forEach(activity => {
      const date = new Date(activity.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!months[monthKey]) {
        months[monthKey] = {
          completed: 0,
          total: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        };
      }

      if (activity.is_complete) {
        months[monthKey].completed++;
      }
    });

    return Object.entries(months)
      .filter(([_, stats]) => stats.completed === stats.total)
      .map(([month]) => month);
  }, [activities]);

  const getCellColor = (day) => {
    if (!day) return 'bg-transparent';
    if (!day.isComplete) return 'bg-gray-200 border-gray-300';

    // Alternate between red and yellow for completed days
    const date = new Date(day.date);
    const dayOfMonth = date.getDate();

    if (dayOfMonth % 2 === 0) {
      return 'bg-spanish-red border-spanish-red shadow-[0_2px_4px_rgba(198,11,30,0.3)]';
    } else {
      return 'bg-spanish-yellow border-spanish-yellow shadow-[0_2px_4px_rgba(255,196,0,0.3)]';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full">
      {/* Perfect month badges */}
      {monthlyStats.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {monthlyStats.map(month => {
            const [year, monthNum] = month.split('-');
            const monthName = new Date(year, monthNum - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

            return (
              <div
                key={month}
                className="px-3 py-2 rounded-lg border-2 border-[#2c2c2c] bg-gradient-to-r from-spanish-red via-spanish-yellow to-spanish-red flex items-center gap-2 shadow-[0_2px_0_#2c2c2c]"
                title={`¡Mes perfecto! - ${monthName}`}
              >
                <span className="text-lg">🏆</span>
                <span className="font-marker text-xs font-bold text-[#2c2c2c] uppercase">
                  {monthName}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Month header - Lego style */}
      <div className="mb-4 flex justify-center">
        <div className="relative inline-block">
          {/* Lego studs */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2c2c2c] border border-[#2c2c2c]" />
            <div className="w-2 h-2 rounded-full bg-[#2c2c2c] border border-[#2c2c2c]" />
          </div>

          {/* Month label */}
          <div className="px-5 py-2 bg-white/90 backdrop-blur-[10px] border-[3px] border-[#2c2c2c] rounded-lg shadow-[0_3px_0_#2c2c2c] relative">
            <div className="absolute inset-0 noise-texture opacity-[0.03] pointer-events-none rounded-[8px]" />
            <div className="font-playful text-lg font-black text-[#2c2c2c] uppercase relative z-10 tracking-wide">
              {calendarData.monthName}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1 min-w-full">
          {/* Day labels column */}
          <div className="flex flex-col gap-1.5">
            {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, i) => (
              <div key={i} className="font-marker text-[10px] text-gray-500 font-bold h-4 flex items-center justify-end pr-1.5">
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-1.5">
            {calendarData.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1.5">
                {week.map((day, dayIndex) => {
                  const dayNumber = day?.dayOfMonth;

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-4 h-4 rounded-sm border transition-all relative ${getCellColor(day)} ${
                        day ? 'hover:scale-110 cursor-pointer' : ''
                      }`}
                      title={day ? `${formatDate(day.date)}\n${day.cardsReviewed} revisadas\n${day.cardsLearned} aprendidas` : ''}
                    >
                      {dayNumber && (
                        <div className="absolute inset-0 flex items-center justify-center text-[6px] font-marker font-bold text-[#2c2c2c] opacity-40">
                          {dayNumber}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-4 text-xs font-marker text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded-sm" />
          <span>sin hacer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-spanish-red border border-spanish-red rounded-sm shadow-sm" />
          <div className="w-4 h-4 bg-spanish-yellow border border-spanish-yellow rounded-sm shadow-sm" />
          <span>completado</span>
        </div>
      </div>
    </div>
  );
}
