import { TableData } from "./table-data.interface";

export interface ResponseBody {
  gameId: string;
  corporation: string | null;
  data: TableData[];
}
