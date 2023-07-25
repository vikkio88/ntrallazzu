import os from "os";
import fs from "fs";
import path from "path";
import { CONF_FILENAME } from "./conf.js";

export function getConfigFileName() {
    return path.join(os.homedir(), CONF_FILENAME);
}

/** 
 * @param {{codefolders: String, projects: string[], editor: String}} config a Config Object
 */
export function saveConfig(config) {
    config.lastRefreshed = new Date();
    fs.writeFileSync(getConfigFileName(), JSON.stringify(config, null, 2));
}