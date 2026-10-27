import { Card, Col, Descriptions, Flex, Row, Typography } from "antd";
import { Link } from "react-router";

const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <Flex className="content-page" vertical gap={24}>
      <div>
        <Title level={2}>О проекте</Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Dashboard для просмотра проектов и управления связанными задачами.
          Приложение разработано в рамках тестового задания.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Проекты и задачи" style={{ height: "100%" }}>
            <Paragraph>
              У каждого проекта есть название, бюджет, дата начала и
              продолжительность. В его задачах указаны стоимость, срок выполнения
              и приоритет.
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              Выберите проект в верхней таблице, чтобы увидеть его задачи в нижней.
              Задачи можно добавлять, редактировать и удалять с подтверждением.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Связь и загрузка данных" style={{ height: "100%" }}>
            <Paragraph>
              Один проект может содержать несколько задач. Каждая задача связана
              с одним проектом, а база данных проверяет существование этой связи.
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>
              Обе таблицы загружают записи порциями по мере прокрутки. Изменения
              отправляются на сервер и сохраняются в PostgreSQL.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Card title="Технологии">
        <Descriptions
          column={{ xs: 1, sm: 1, md: 2 }}
          items={[
            { key: "client", label: "Клиент", children: "React, TypeScript, Vite" },
            { key: "ui", label: "Интерфейс", children: "Ant Design, React Router" },
            { key: "grids", label: "Таблицы", children: "AG Grid Community" },
            { key: "server", label: "Сервер", children: "Node.js, Express, TypeScript" },
            { key: "database", label: "База данных", children: "PostgreSQL, Sequelize" },
            { key: "validation", label: "Проверка запросов", children: "Zod" },
          ]}
        />
        <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
          Сервер предоставляет REST API для проектов и задач. Маршруты,
          контроллеры и модели разделены; списки выбираются SQL-запросами с LIMIT
          и OFFSET.
        </Paragraph>
        <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
          Визуальная композиция основана на паттернах современных Material
          Dashboard и примерах Berry: светлая рабочая область, карточки и
          фиолетово-синие акценты.
        </Paragraph>
      </Card>

      <Paragraph style={{ marginBottom: 0 }}>
        <Link to="/">Открыть проекты</Link>
        {" · "}
        <Link to="/instructions">Как пользоваться приложением</Link>
      </Paragraph>
    </Flex>
  );
};

export default About;
