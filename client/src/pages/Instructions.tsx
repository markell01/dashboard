import { Card, Descriptions, Flex, Typography } from "antd";
import { Link } from "react-router";

const { Title, Paragraph, Text } = Typography;

const taskActions = [
  {
    title: "Добавить задачу",
    description:
      "Нажмите «Добавить» над таблицей задач. Заполните название, стоимость, срок выполнения и приоритет, затем нажмите «Добавить» в форме. Задача будет связана с выбранным проектом.",
  },
  {
    title: "Изменить задачу",
    description:
      "Выберите строку задачи и нажмите «Изменить». Отредактируйте поля и нажмите «Сохранить». Проект в текущей форме закреплён: перенести задачу в другой проект через интерфейс нельзя.",
  },
  {
    title: "Удалить задачу",
    description:
      "Выберите строку задачи и нажмите «Удалить». Проверьте название в окне подтверждения. Нажмите «Удалить», чтобы подтвердить действие, или «Отмена», чтобы сохранить задачу. Удаление нельзя отменить.",
  },
];

const Instructions = () => {
  return (
    <Flex vertical gap={24}>
      <div>
        <Title level={2}>Инструкции</Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Как просматривать проекты и работать с их задачами.
        </Paragraph>
      </div>

      <Card title="Начните с выбора проекта">
        <Paragraph>
          Откройте раздел <Link to="/">«Проекты»</Link> и нажмите на строку в
          верхней таблице. Ниже появятся задачи этого проекта. При выборе другого
          проекта список задач обновится.
        </Paragraph>
        <Paragraph style={{ marginBottom: 0 }}>
          Прокручивайте таблицы вниз, чтобы увидеть следующие записи. Если у
          проекта пока нет задач, вы можете добавить первую. Кнопки «Изменить» и
          «Удалить» становятся доступны после выбора задачи.
        </Paragraph>
      </Card>

      <Card title="Работа с задачами">
        <ol style={{ paddingInlineStart: 20, margin: 0 }}>
          {taskActions.map((action, index) => (
            <li
              key={action.title}
              style={{ marginBottom: index === taskActions.length - 1 ? 0 : 20 }}
            >
              <Text strong>{action.title}</Text>
              <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                {action.description}
              </Paragraph>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="Поля формы">
        <Descriptions
          column={1}
          items={[
            {
              key: "project",
              label: "ID проекта",
              children: "Заполняется автоматически и недоступен для изменения.",
            },
            {
              key: "title",
              label: "Название",
              children: "Обязательное поле, до 200 символов. Одних пробелов недостаточно.",
            },
            {
              key: "cost",
              label: "Стоимость",
              children: "Сумма в рублях от 0 до 9 999 999 999,99, не более двух знаков после запятой.",
            },
            {
              key: "date",
              label: "Срок выполнения",
              children: "Обязательная дата. Выберите её в календаре.",
            },
            {
              key: "priority",
              label: "Приоритет",
              children: "Число от 1 до 5: чем оно больше, тем выше приоритет задачи.",
            },
          ]}
        />
      </Card>

      <Card title="Если возникла ошибка">
        <Paragraph>
          Если таблица не загрузилась, проверьте доступность сервера и нажмите
          «Повторить» в сообщении над таблицей.
        </Paragraph>
        <Paragraph style={{ marginBottom: 0 }}>
          Если форма показывает ошибку под полем, исправьте значение. Если ошибка
          возникла при сохранении, введённые данные останутся в открытой форме.
          Дождитесь результата отправки, прежде чем закрывать окно.
        </Paragraph>
      </Card>
    </Flex>
  );
};

export default Instructions;
