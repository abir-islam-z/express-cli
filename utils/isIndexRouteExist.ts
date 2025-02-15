import fs from "fs-extra";
import { INDEX_ROUTE_PATH } from "../const";

export const isIndexRouteFileExists = async () => {
  return fs.existsSync(INDEX_ROUTE_PATH);
};
