"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function DateSelector() {
  const router = useRouter();
  const params = useSearchParams();

  const current = params.get("date") ?? new Date().toISOString().slice(0, 10);

  return (
    <input
      type="date"
      defaultValue={current}
      onChange={(e) => {
        const newDate = e.target.value;
        router.push(`?date=${newDate}`);
      }}
      className="border px-3 py-2 rounded"
    />
  );
}
