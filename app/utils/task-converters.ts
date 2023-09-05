import type {
  ScheduledTask,
  ScheduledTaskDto,
  ScheduledTasks,
} from "../../types";
import { MS_IN_SECOND } from "./date-time";

export const createScheduledTask = (dto: ScheduledTaskDto): ScheduledTask => ({
  ...dto,
  startTime: new Date(dto.time * MS_IN_SECOND),
  endTime: new Date((dto.time + dto.duration) * MS_IN_SECOND),
  prefer_startunix: new Date(dto.prefer_startunix * MS_IN_SECOND),
  deadline: dto.deadline ? new Date(dto.deadline * MS_IN_SECOND) : undefined,
});

export const createScheduledTasks = (
  dtos: ScheduledTaskDto[]
): ScheduledTasks =>
  dtos.reduce(
    (acc, dto) => ({ ...acc, [dto.eid]: createScheduledTask(dto) }),
    {}
  );
