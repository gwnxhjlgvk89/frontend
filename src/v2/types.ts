export interface User {
  id: number;
  username: string;
  name: string;
  role: "student" | "admin" | "super_admin";
  major: string;
  class_name: string;
  active: boolean;
  must_change_password: boolean;
  phone: string;
  email: string;
}
export interface Club {
  id: number;
  name: string;
  category: string;
  description?: string;
  location: string;
  schedule: string;
  cover: string;
  capacity: number;
  remaining: number;
  active: boolean;
  allowed_majors: string[];
  version: number;
}
export interface Enrollment {
  club_id: number;
  club_name: string;
  source: "normal" | "reserved";
  created_at: string;
}
export interface Activity {
  name: string;
  state: string;
  configured_state: string;
  starts_at: string | null;
  ends_at: string | null;
  allow_cancel: boolean;
  cancel_until: string | null;
  version: number;
}
export interface Quota {
  club_id: number;
  remaining: number;
  version: number;
}
export interface Bootstrap {
  user: User;
  activity: Activity;
  server_time: string;
  enrollment: Enrollment | null;
  favorites: number[];
  clubs: Club[];
  quotas: Quota[];
}
export interface Job {
  id: string;
  state: string;
  result: {
    message?: string;
    rows?: number;
    preview?: Record<string, string>[];
    download?: string;
  };
}
