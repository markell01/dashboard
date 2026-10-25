import type { IDatasource } from "ag-grid-community";
import type { Project } from "../../types/types";
import { AgGridReact } from "ag-grid-react";
import { Card } from "antd";
import { colProjectDefs } from "./projectColumns";
import { defaultColDef } from "./defaultColumnDef";

interface ProjectsGridProps {
  datasource: IDatasource;
  onProjectSelect: (project: Project | null) => void;
}

const ProjectGrid = ({ datasource, onProjectSelect }: ProjectsGridProps) => {
  return (
    <Card title={"Проекты"} style={{ marginBottom: 20 }}>
      <div style={{ width: "100%", height: 400 }}>
        <AgGridReact<Project>
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
        />
      </div>
    </Card>
  );
};

export default ProjectGrid;
