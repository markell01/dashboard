import type { ColDef } from "ag-grid-community";
import type { Project } from "../../types/types";

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
  },
  {
    field: "startDate",
    headerName: "Дата начала",
    minWidth: 150,
  },
  {
    field: "durationDays",
    headerName: "Продолжительность",
    minWidth: 170,
  },
];
