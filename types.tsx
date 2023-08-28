export type UserDto = {
  uid: string;
  name: string;
  alias: string;
  languages: string[];
  profilePicture: string;
};

export type User = UserDto;

export type PatientDto = UserDto & {
  allergies: string[];
  room: string;
};

export type Patient = PatientDto;

export type Recurrance =
  | "hourly"
  | "daily"
  | "weekly"
  | "fortnightly"
  | "monthly";

// details hydrated server-side.
// client only responsible for displaying the information.
export type TaskDto = {
  eid: string;
  task_name: string;
  priority: number;
  duration: number;
  separable: boolean;
  separable_parent?: TaskDto["eid"];
  deadline?: number;
  prefer_startunix: number;
  recurring?: Recurrance | number;
  recurring_parent?: TaskDto["eid"];
  recurrance: number;
  sequential_parent?: TaskDto["eid"];
  sequential_child?: TaskDto["eid"][];
  participants: UserDto[];
  optional_participants?: UserDto[];
  residents?: PatientDto[];
  // prefer_timeslot?: number; //kiv
  add_unix: number;
  status: number;
  facility: string;
  logistics: string;
};

export type ScheduledTaskDto = TaskDto & {
  limit_start_timeslot: number;
  limit_end_timeslot: number;
  score: number;
  time: number;
};

export type ScheduledTask = Omit<
  ScheduledTaskDto,
  "prefer_startunix" | "deadline" | "time"
> & {
  prefer_startunix: Date;
  deadline?: Date;
  startTime: Date;
  endTime: Date;
};

export type ScheduledTasks = {
  [eid: ScheduledTask["eid"]]: ScheduledTask;
};
