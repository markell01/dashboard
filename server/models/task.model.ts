import {
  DataTypes,
  ForeignKeyConstraintError,
  QueryTypes,
  type Model,
  type Optional,
} from "sequelize";
import { sequelize } from "../config/dbconnection.js";
import type {
  CreateTask,
  TaskQuery,
  UpdateTask,
} from "../schemas/tasks.schema.js";

interface Task {
  id: number;
  projectId: number;
  title: string;
  estimatedCost: string;
  dueDate: string;
  priority: number;
}

interface TaskCountRow {
  total: string;
}

export type UpdateTaskResult =
  | {
      status: "updated";
      task: Task;
    }
  | {
      status: "taskNotFound";
    }
  | {
      status: "projectNotFound";
    };

export const TaskModel = sequelize.define<Model<Task, Optional<Task, "id">>>(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "project_id",
      references: {
        model: "projects",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "estimated_cost",
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "due_date",
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tasks",
    timestamps: false,
  },
);

export async function getTasks(query: TaskQuery): Promise<Task[]> {
  const projectId = query.projectId ?? null;

  return sequelize.query<Task>(
    `
      SELECT
        id,
        project_id AS "projectId",
        title,
        estimated_cost::text AS "estimatedCost",
        to_char(due_date, 'YYYY-MM-DD') AS "dueDate",
        priority
      FROM tasks
      WHERE ($1::integer IS NULL OR project_id = $1)
      ORDER By id DESC
      LIMIT $2
      OFFSET $3
    `,
    {
      type: QueryTypes.SELECT,
      bind: [projectId, query.limit, query.offset],
    },
  );
}

export async function countTasks(projectId?: number): Promise<number> {
  const rows = await sequelize.query<TaskCountRow>(
    `
      SELECT COUNT(*) AS total
      FROM tasks
      WHERE ($1::integer IS NULL OR project_id = $1)
    `,
    {
      type: QueryTypes.SELECT,
      bind: [projectId ?? null],
    },
  );

  const row = rows[0];

  if (!row) {
    throw new Error("Не удалось получить кол-во задач");
  }

  return Number(row.total);
}

export async function getTaskById(id: number): Promise<Task | null> {
  const task = await TaskModel.findByPk(id);

  if (!task) return null;

  return task.toJSON();
}

export async function createTask(data: CreateTask): Promise<Task | null> {
  try {
    return (await TaskModel.create(data)).toJSON();
  } catch (err: unknown) {
    if (err instanceof ForeignKeyConstraintError) {
      return null;
    }

    throw err;
  }
}

export async function updateTask(
  id: number,
  data: UpdateTask,
): Promise<UpdateTaskResult> {
  const task = await TaskModel.findByPk(id);

  if (!task) {
    return {
      status: "taskNotFound",
    };
  }
  const updateData: Partial<Task> = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.projectId !== undefined) {
    updateData.projectId = data.projectId;
  }

  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate;
  }

  if (data.priority !== undefined) {
    updateData.priority = data.priority;
  }

  if (data.estimatedCost !== undefined) {
    updateData.estimatedCost = data.estimatedCost;
  }

  try {
    await task.update(updateData);

    return {
      status: "updated",
      task: task.toJSON(),
    };
  } catch (err: unknown) {
    if (err instanceof ForeignKeyConstraintError) {
      return {
        status: "projectNotFound",
      };
    }

    throw err;
  }
}

export async function deleteTask(id: number): Promise<boolean> {
  const task = await TaskModel.findByPk(id);

  if (!task) return false;

  await task.destroy();

  return true;
}