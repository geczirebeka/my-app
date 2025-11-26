"use client";

import { startOfDay, addDays, addMinutes, format, isBefore } from "date-fns";
import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import BookingModal from "./BookingModal";

type Props = {
  club: {
    id: string;
    name: string;
    allowed_durations: number[];
    courts: { id: string; name: string }[];
    recurring_availability: {
      weekday: number;
      start_time: string;
      end_time: string;
    }[];
  };
};

export default function CalendarClient({ club }: Props) {
  const [selectedDay, setSelectedDay] = useState(startOfDay(new Date()));
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  const days = useMemo(() => {
    return [...Array(7)].map((_, i) => addDays(startOfDay(new Date()), i));
  }, []);

  // Load bookings for the selected day
  useEffect(() => {
    async function load() {
      const dateStr = format(selectedDay, "yyyy-MM-dd");

      const res = await fetch(
        `/api/bookings?clubId=${club.id}&date=${dateStr}`,
      );

      const data = await res.json();
      setBookings(data ?? []);
    }

    load();
  }, [selectedDay, club.id]);

  // Generate slots using recurring availability rules
  const slots = useMemo(() => {
    const weekday = selectedDay.getDay();

    const todaysRules = club.recurring_availability.filter(
      (r) => r.weekday === weekday,
    );

    if (!todaysRules.length) return [];

    const slots = [];

    for (const rule of todaysRules) {
      const [sh, sm] = rule.start_time.split(":").map(Number);
      const [eh, em] = rule.end_time.split(":").map(Number);

      const open = new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate(),
        sh,
        sm,
      );

      const close = new Date(
        selectedDay.getFullYear(),
        selectedDay.getMonth(),
        selectedDay.getDate(),
        eh,
        em,
      );

      let cursor = open;

      while (isBefore(cursor, close)) {
        for (const court of club.courts) {
          slots.push({
            start: new Date(cursor),
            court,
          });
        }
        cursor = addMinutes(cursor, 30); // fixed resolution
      }
    }

    return slots;
  }, [selectedDay, club]);

  // Remove slots that overlap with existing bookings
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      return !bookings.some((b) => {
        const bookedStart = new Date(b.start_ts);
        const bookedEnd = new Date(b.end_ts);
        const slotEnd = addMinutes(slot.start, 60); // temporary 1hr span

        return (
          b.court_id === slot.court.id &&
          slot.start < bookedEnd &&
          slotEnd > bookedStart
        );
      });
    });
  }, [slots, bookings]);

  function selectSlot(slot) {
    setSelectedSlot(slot);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* DAY SELECTOR */}
      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {days.map((d) => {
            const isSelected =
              format(d, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd");

            return (
              <button
                key={d.toString()}
                onClick={() => setSelectedDay(d)}
                className={`min-w-[90px] px-3 py-2 rounded-lg border ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-white"
                }`}
              >
                <div className="text-xs">{format(d, "EEE")}</div>
                <div className="font-medium">{format(d, "d LLL")}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SLOTS */}
      <Card>
        <CardContent>
          <div className="text-lg font-semibold mb-4">
            {format(selectedDay, "EEEE d LLLL yyyy")}
          </div>

          {club.courts.map((court) => (
            <div key={court.id} className="mb-6">
              <div className="font-medium mb-2">{court.name}</div>

              <div className="flex flex-wrap gap-2">
                {filteredSlots
                  .filter((s) => s.court.id === court.id)
                  .map((s, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-2 rounded-lg border bg-white hover:bg-muted text-sm"
                      onClick={() => selectSlot(s)}
                    >
                      {format(s.start, "HH:mm")}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* MODAL */}
      {selectedSlot && (
        <BookingModal
          open={isModalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedSlot(null);
          }}
          slot={selectedSlot}
          allowedDurations={club.allowed_durations}
          clubId={club.id}
        />
      )}
    </div>
  );
}
