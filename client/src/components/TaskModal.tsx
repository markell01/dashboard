import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  type FormInstance,
} from "antd";
import type { TaskModalMode, TaskFormValues } from "../types/types";

interface TaskModalProps {
  mode: TaskModalMode;
  form: FormInstance<TaskFormValues>;
  loading: boolean;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  onClose: () => void;
}

const TaskModal = ({
  mode,
  form,
  loading,
  onSubmit,
  onClose,
}: TaskModalProps) => {
  return (
    <Modal
      open={mode !== null}
      title={mode === "create" ? "Добавление задачи" : "Изменение задачи"}
      okText={mode === "create" ? "Добавить" : "Сохранить"}
      cancelText="Отмена"
      confirmLoading={loading}
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
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
          <InputNumber disabled style={{ width: "100%" }} />
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
          <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
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
  );
};

export default TaskModal;
