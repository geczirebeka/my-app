export type Club = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  allowed_durations: number[];
};

export type Court = {
  id: string;
  club_id: string;
  name: string;
};

export type Pricing = {
  duration_minutes: number;
  price_numeric: number;
};

export type RecurringAvailability = {
  weekday: number;
  start_time: string;
  end_time: string;
};

export type Booking = {
  court_id: string;
  start_ts: string;
  end_ts: string;
};
