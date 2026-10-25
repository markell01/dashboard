import type { Dayjs } from "dayjs";

export interface Project {
  id: number;
  title: string;
  budget: string;
  startDate: string;
  durationDays: number;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  estimatedCost: string;
  dueDate: string;
  priority: number;
}

export interface TaskFormValues {
  projectId: number;
  title: string;
  estimatedCost: string;
  dueDate: Dayjs;
  priority: number;
}

export interface ListInterface<T> {
  items: T[];
  total: number;
}

export type TaskModalMode = "create" | "edit" | null;