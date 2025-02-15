import fs from "fs-extra";
import { INDEX_ROUTE_PATH } from "../const";

/**
 * Check if the index route file exists
 * @returns A promise that resolves to a boolean
 */

export const isIndexRouteFileExists = async () => {
  return fs.existsSync(INDEX_ROUTE_PATH);
};
