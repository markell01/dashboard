import { sequelize } from "../config/dbconnection.js";
import type {
  CreateProjectType,
  ProjectsQuery,
  UpdateProjectType,
} from "../schemas/projects.schema.js";
import { DataTypes, Model, QueryTypes, type Optional } from "sequelize";

export interface Project {
  id: number;
  title: string;
  budget: string;
  startDate: string;
  durationDays: number;
}

export interface ProjectCountRow {
  total: string;
}

export const ProjectModel = sequelize.define<
  Model<Project, Optional<Project, "id">>
>(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "start_date",
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "duration_days",
    },
  },
  {
    tableName: "projects",
    timestamps: false,
  },
);

export async function getProjects(query: ProjectsQuery): Promise<Project[]> {
  const items = await sequelize.query<Project>(
    `
      SELECT
          id,
          title,
          budget::text AS budget,
          to_char(start_date, 'YYYY-MM-DD') AS "startDate",
          duration_days AS "durationDays"
      FROM projects
      ORDER BY id ASC
      LIMIT $1
      OFFSET $2
    `,
    {
      type: QueryTypes.SELECT,
      bind: [query.limit, query.offset],
    },
  );

  return items;
}

export async function countProjects(): Promise<number> {
  const rows = await sequelize.query<ProjectCountRow>(
    `
        SELECT COUNT(*) AS total
        FROM projects
    `,
    {
      type: QueryTypes.SELECT,
    },
  );

  const row = rows[0];

  if (!row) {
    throw new Error("Не удалось получить кол-во проектов");
  }

  return Number(row.total);
}

export async function projectsById(id: number): Promise<Project | null> {
  const project = await ProjectModel.findByPk(id);

  if (!project) {
    return null;
  }

  return project.toJSON();
}

export async function createProject(data: CreateProjectType): Promise<Project> {
  const project = await ProjectModel.create(data);

  return project.toJSON();
}

export async function updateProject(
  id: number,
  data: UpdateProjectType,
): Promise<Project | null> {
  const project = await ProjectModel.findByPk(id);

  if (!project) return null;

  const updateData: Partial<Project> = {}

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.budget !== undefined) {
    updateData.budget = data.budget;
  }

  if (data.startDate !== undefined) {
    updateData.startDate = data.startDate;
  }

  if (data.durationDays !== undefined) {
    updateData.durationDays = data.durationDays;
  }

  return (await project.update(updateData)).toJSON();
}

export async function deleteProject(id: number): Promise<boolean> {
  const project = await ProjectModel.findByPk(id);

  if (!project) return false;

  await project.destroy();

  return true;
}
