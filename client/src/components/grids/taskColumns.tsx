import type { ColDef } from "ag-grid-community";
import { Tag } from "antd";
import type { Task } from "../../types/types";
import { formatCurrency, formatDate } from "../../utils/formatter";

const priorities: Record<number, { label: string; color: string }> = {
  1: { label: "Низкий", color: "green" },
  2: { label: "Ниже среднего", color: "cyan" },
  3: { label: "Средний", color: "blue" },
  4: { label: "Высокий", color: "orange" },
  5: { label: "Критический", color: "red" },
};

export const colTaskDefs: ColDef<Task>[] = [
  {
    field: "id",
    headerName: "ID",
    width: 90,
    maxWidth: 100,
    flex: 0,
  },
  {
    field: "title",
    headerName: "Название задачи",
    minWidth: 220,
    flex: 2,
  },
  {
    field: "estimatedCost",
    headerName: "Стоимость",
    minWidth: 160,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "dueDate",
    headerName: "Срок выполнения",
    minWidth: 170,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: "priority",
    headerName: "Приоритет",
    minWidth: 140,
    cellRenderer: ({ value }: { value: number }) => {
      const priority = priorities[value];
      return priority ? <Tag color={priority.color}>{priority.label}</Tag> : "";
    },
  },
];
