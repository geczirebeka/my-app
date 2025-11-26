"use client";

import { addMinutes, format } from "date-fns";
import { useState, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  slot: {
    start: Date;
    court: { id: string; name: string };
  };
  allowedDurations: number[];
  clubId: string;
};

export default function BookingModal({
  open,
  onClose,
  slot,
  allowedDurations,
  clubId,
}: BookingModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedDuration(allowedDurations[0] ?? null);
    }
  }, [open, allowedDurations]);

  const endTime = useMemo(() => {
    if (!selectedDuration) return slot.start;
    return addMinutes(slot.start, selectedDuration);
  }, [slot.start, selectedDuration]);

  async function handleCheckout() {
    if (!selectedDuration) return;

    setLoading(true);

    const startTs = slot.start.toISOString();
    const endTs = new Date(
      slot.start.getTime() + selectedDuration * 60000,
    ).toISOString();

    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clubId,
        courtId: slot.court.id,
        startTs,
        endTs,
        userId: null, // or pass the logged-in user ID once added auth
      }),
    });

    const data = await res.json();

    if (data.error) {
      console.error("Checkout error:", data.error);
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book {slot.court.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Time summary */}
          <div className="text-sm space-y-1">
            <div>
              <strong>Start:</strong> {format(slot.start, "HH:mm")}
            </div>
            <div>
              <strong>End:</strong> {format(endTime, "HH:mm")}
            </div>
          </div>

          {/* Duration selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select duration</label>
            <div className="flex flex-wrap gap-2">
              {allowedDurations.map((d) => (
                <Button
                  key={d}
                  variant={selectedDuration === d ? "default" : "outline"}
                  onClick={() => setSelectedDuration(d)}
                >
                  {d} min
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            disabled={loading}
            onClick={handleCheckout}
          >
            {loading ? "Redirecting…" : "Continue to Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
