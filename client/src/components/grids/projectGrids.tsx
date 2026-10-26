import type { IDatasource } from "ag-grid-community";
import type { Project } from "../../types/types";
import { AgGridReact } from "ag-grid-react";
import { Alert, Button, Card } from "antd";
import { colProjectDefs } from "./projectColumns";
import { defaultColDef } from "./defaultColumnDef";
import { useRef } from "react";

interface ProjectsGridProps {
  datasource: IDatasource;
  loadError: boolean;
  onRetry: () => void;
  onProjectSelect: (project: Project | null) => void;
}

const ProjectGrid = ({
  datasource,
  loadError,
  onRetry,
  onProjectSelect,
}: ProjectsGridProps) => {
  const gridRef = useRef<AgGridReact<Project>>(null);

  return (
    <Card title={"Проекты"} style={{ marginBottom: 20 }}>
      {loadError && (
        <Alert
          type="error"
          showIcon
          message="Не удалось загрузить проекты"
          description="Проверьте соединение с сервером и повторите попытку."
          style={{ marginBottom: 16 }}
          action={
            <Button
              size="small"
              onClick={() => {
                onRetry();
                gridRef.current?.api.purgeInfiniteCache();
              }}
            >
              Повторить
            </Button>
          }
        />
      )}
      <div style={{ width: "100%", height: 400 }}>
        <AgGridReact<Project>
          ref={gridRef}
          rowModelType="infinite"
          datasource={datasource}
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
            onProjectSelect(project);
          }}
          defaultColDef={defaultColDef}
          getRowId={(params) => String(params.data.id)}
          localeText={{
            loadingOoo: "Загрузка...",
            noRowsToShow: "Проекты не найдены",
          }}
          overlayNoRowsTemplate="Проекты не найдены"
        />
      </div>
    </Card>
  );
};

export default ProjectGrid;
