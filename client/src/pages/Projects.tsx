import { useMemo, useRef, useState } from "react";
import { instance } from "../api/instance";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { Button, Card, Form, message, Modal, Space, Typography } from "antd";
import dayjs from "dayjs";
import type {
  Project,
  Task,
  TaskModalMode,
  TaskFormValues,
} from "../types/types";
import { createDatasource } from "../components/grids/createDatasource";
import { colTaskDefs } from "../components/grids/taskColumns";
import TaskModal from "../components/TaskModal";
import ProjectGrid from "../components/grids/projectGrids";
import { defaultColDef } from "../components/grids/defaultColumnDef";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasksGridRef = useRef<AgGridReact<Task>>(null);
  const [taskModalMode, setTaskModalMode] = useState<TaskModalMode>(null);
  const [savingTask, setSavingTask] = useState(false);
  const [taskForm] = Form.useForm<TaskFormValues>();

  const handleProjectSelect = (project: Project | null) => {
    setSelectedProject(project);
    setSelectedTask(null);
  };

  const handleDeleteTask = () => {
    if (!selectedTask) {
      return;
    }

    Modal.confirm({
      title: "Удалить задачу?",
      content: `Задача «${selectedTask.title}» будет удалена без возможности восстановления`,
      okText: "Удалить",
      cancelText: "Отмена",
      okButtonProps: {
        danger: true,
      },

      onOk: async () => {
        try {
          await instance.delete(`/tasks/${selectedTask.id}`);

          setSelectedTask(null);
          tasksGridRef.current?.api.purgeInfiniteCache();

          message.success("Задача удалена");
        } catch (err) {
          console.error(err);
          message.error("Не удалось удалить задачу");

          throw err;
        }
      },
    });
  };

  const handleOpenCreateTask = () => {
    if (!selectedProject) {
      return;
    }

    taskForm.resetFields();

    taskForm.setFieldsValue({
      projectId: selectedProject.id,
      title: "",
      estimatedCost: "0.00",
      priority: 3,
    });

    setTaskModalMode("create");
  };

  const handleOpenEditTask = () => {
    if (!selectedTask) {
      return;
    }

    taskForm.resetFields();

    taskForm.setFieldsValue({
      projectId: selectedTask.projectId,
      title: selectedTask.title,
      estimatedCost: selectedTask.estimatedCost,
      dueDate: dayjs(selectedTask.dueDate),
      priority: selectedTask.priority,
    });

    setTaskModalMode("edit");
  };

  const handleSubmitTask = async (values: TaskFormValues) => {
    const payload = {
      projectId: values.projectId,
      title: values.title.trim(),
      estimatedCost: values.estimatedCost,
      dueDate: values.dueDate.format("YYYY-MM-DD"),
      priority: values.priority,
    };

    try {
      setSavingTask(true);

      if (taskModalMode === "create") {
        await instance.post("/tasks", payload);
        message.success("Задача создана!");
      }

      if (taskModalMode === "edit") {
        await instance.patch(`/tasks/${selectedTask?.id}`, payload);
        message.success("Задача изменена!");
      }

      setTaskModalMode(null);
      setSelectedTask(null);
      taskForm.resetFields();

      tasksGridRef.current?.api.purgeInfiniteCache();
    } catch (err) {
      console.error("Ошибка сохранения задачи:", err);
      message.error("Не удалось сохранить задачу");
    } finally {
      setSavingTask(false);
    }
  };

  const projectsDatasource = useMemo(
    () => createDatasource<Project>("/projects"),
    [],
  );

  const tasksDatasource = useMemo(
    () =>
      selectedProject
        ? createDatasource<Task>("/tasks", {
            projectId: selectedProject.id,
          })
        : null,
    [selectedProject],
  );

  return (
    <AgGridProvider modules={[AllCommunityModule]}>
      <ProjectGrid
        datasource={projectsDatasource}
        onProjectSelect={handleProjectSelect}
      />

      <TaskModal
        mode={taskModalMode}
        form={taskForm}
        loading={savingTask}
        onSubmit={handleSubmitTask}
        onClose={() => {
          setTaskModalMode(null);
          taskForm.resetFields();
        }}
      />

      {selectedProject ? (
        <Card
          title={`Задачи проекта «${selectedProject.title}»`}
          extra={
            <Space>
              <Button type="primary" onClick={handleOpenCreateTask}>
                Добавить
              </Button>

              <Button disabled={!selectedTask} onClick={handleOpenEditTask}>
                Изменить
              </Button>

              <Button
                danger
                disabled={!selectedTask}
                onClick={handleDeleteTask}
              >
                Удалить
              </Button>
            </Space>
          }
        >
          <div style={{ width: "100%", height: 400 }}>
            <AgGridReact<Task>
              ref={tasksGridRef}
              rowModelType="infinite"
              datasource={tasksDatasource ?? undefined}
              cacheBlockSize={50}
              maxBlocksInCache={5}
              columnDefs={colTaskDefs}
              defaultColDef={defaultColDef}
              getRowId={(params) => String(params.data.id)}
              localeText={{
                loadingOoo: "Загрузка...",
                noRowsToShow: "У выбранного проекта пока нет задач",
              }}
              overlayNoRowsTemplate="У выбранного проекта пока нет задач"
              rowSelection={{
                mode: "singleRow",
                enableClickSelection: true,
                checkboxes: false,
              }}
              onSelectionChanged={(event) => {
                const task = event.api.getSelectedRows()[0] ?? null;
                setSelectedTask(task);
              }}
            />
          </div>
        </Card>
      ) : (
        <Card title="Задачи">
          <Typography.Text type="secondary">
            Выберите проект в верхней таблице, чтобы увидеть связанные задачи
          </Typography.Text>
        </Card>
      )}
    </AgGridProvider>
  );
};

export default Projects;
