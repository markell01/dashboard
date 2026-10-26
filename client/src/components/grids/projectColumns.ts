import type { ColDef } from "ag-grid-community";
import type { Project } from "../../types/types";
import { formatCurrency, formatDate } from "../../utils/formatter";

export const colProjectDefs: ColDef<Project>[] = [
  {
    field: "id",
    headerName: "ID",
    width: 90,
    maxWidth: 100,
    flex: 0,
  },
  {
    field: "title",
    headerName: "Название проекта",
    minWidth: 220,
    flex: 2,
  },
  {
    field: "budget",
    headerName: "Бюджет",
    minWidth: 160,
    valueFormatter: ({ value }) => formatCurrency(value),
  },
  {
    field: "startDate",
    headerName: "Дата начала",
    minWidth: 150,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: "durationDays",
    headerName: "Продолжительность",
    minWidth: 170,
    valueFormatter: ({ value }) =>
    value === null || value === undefined
      ? ""
      : `${value} дн.`,
  },
];
