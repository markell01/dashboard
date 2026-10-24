import { useMemo, useRef, useState } from "react";
import { instance } from "../components/instance";
import {
  AllCommunityModule,
  type ColDef,
  type IDatasource,
  type IGetRowsParams,
} from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { Button, Card, DatePicker, Form, Input, InputNumber, message, Modal, Select, Space, Typography } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface Project {
  id: number;
  title: string;
  budget: string;
  startDate: string;
  durationDays: number;
}

interface Task {
  id: number;
  projectId: number;
  title: string;
  estimatedCost: string;
  dueDate: string;
  priority: number;
}

interface TaskFormValues {
  projectId: number;
  title: string;
  estimatedCost: string;
  dueDate: Dayjs;
  priority: number;
}

type TaskModalMode = "create" | "edit" | null;

interface ListInterface<T> {
  items: T[];
  total: number;
}

const createDatasource = <T,>(
  url: string,
  extraParams: Record<string, string | number> = {},
): IDatasource => ({
  getRows: async (params: IGetRowsParams) => {
    const { startRow, endRow } = params;

    try {
      const response = await instance.get<ListInterface<T>>(url, {
        params: {
          ...extraParams,
          limit: endRow - startRow,
          offset: startRow,
        },
      });

      params.successCallback(response.data.items, response.data.total);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      params.failCallback();
    }
  },
});

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasksGridRef = useRef<AgGridReact<Task>>(null);
  const [taskModalMode, setTaskModalMode] = useState<TaskModalMode>(null);
  const [savingTask, setSavingTask] = useState(false);
  const [taskForm] = Form.useForm<TaskFormValues>();

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

  const colProjectDefs = useMemo<ColDef<Project>[]>(
    () => [
      { field: "id" },
      { field: "title" },
      { field: "budget" },
      { field: "startDate" },
      { field: "durationDays" },
    ],
    [],
  );

  const colTaskDefs = useMemo<ColDef<Task>[]>(
    () => [
      { field: "id" },
      { field: "projectId" },
      { field: "title" },
      { field: "estimatedCost" },
      { field: "dueDate" },
      { field: "priority" },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
    }),
    [],
  );

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
      <div style={{ width: "100%", height: 400, padding: 10 }}>
        <AgGridReact<Project>
          rowModelType="infinite"
          datasource={projectsDatasource}
          cacheBlockSize={50}
          maxBlocksInCache={5}
          columnDefs={colProjectDefs}
          rowSelection={{
            mode: "singleRow",
            enableClickSelection: true,
            checkboxes: false,
          }}
          onSelectionChanged={(event) => {
            const project = event.api.getSelectedRows()[0] ?? null;

            setSelectedProject(project);
            setSelectedTask(null);
          }}
          defaultColDef={defaultColDef}
          getRowId={(params) => String(params.data.id)}
        />
      </div>

      <Modal
        open={taskModalMode !== null}
        title={
          taskModalMode === "create"
            ? "Добавление задачи"
            : "Изменение задачи"
        }
        okText={
          taskModalMode === "create"
            ? "Добавить"
            : "Сохранить"
        }
        cancelText="Отмена"
        confirmLoading={savingTask}
        onOk={() => taskForm.submit()}
        onCancel={() => {
          setTaskModalMode(null);
          taskForm.resetFields();
        }}
      >
        <Form
          form={taskForm}
          layout="vertical"
          onFinish={handleSubmitTask}
        >
          <Form.Item
            name="projectId"
            label="ID проекта"
            rules={[
              {
                required: true,
                message: "Укажите проект",
              },
            ]}
          >
            <InputNumber
              disabled
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="title"
            label="Название"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Введите название задачи",
              },
              {
                max: 200,
                message: "Не более 200 символов",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="estimatedCost"
            label="Стоимость"
            rules={[
              {
                required: true,
                message: "Укажите стоимость",
              },
            ]}
          >
            <InputNumber
              stringMode
              min={0}
              max={9999999999.99}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Срок выполнения"
            rules={[
              {
                required: true,
                message: "Выберите срок выполнения",
              },
            ]}
          >
            <DatePicker
              format="DD.MM.YYYY"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Приоритет"
            rules={[
              {
                required: true,
                message: "Выберите приоритет",
              },
            ]}
          >
            <Select
              options={[
                { value: 1, label: "1 — низкий" },
                { value: 2, label: "2" },
                { value: 3, label: "3 — средний" },
                { value: 4, label: "4" },
                { value: 5, label: "5 — высокий" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {selectedProject ? (
        <Card
          title={`Задачи проекта «${selectedProject.title}»`}
          extra={
            <Space>
              <Button
                type="primary"
                onClick={handleOpenCreateTask}
              >
                Добавить
              </Button>

              <Button
                disabled={!selectedTask}
                onClick={handleOpenEditTask}
              >
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
        <Typography.Text type="secondary">
          Выберите проект, чтобы увидеть его задачи
        </Typography.Text>
      )}
    </AgGridProvider>
  );
};

export default Projects;
