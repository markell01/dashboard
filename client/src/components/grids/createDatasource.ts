import type { IDatasource, IGetRowsParams } from "ag-grid-community";
import type { ListInterface } from "../../types/types";
import { instance } from "../../api/instance";

export const createDatasource = <T>(
  url: string,
  extraParams: Record<string, string | number> = {},
  onLoadErrorChange?: (hasError: boolean) => void,
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

      onLoadErrorChange?.(false);
      params.successCallback(response.data.items, response.data.total);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      onLoadErrorChange?.(true);
      params.failCallback();
    }
  },
});
