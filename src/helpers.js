import os from "os";
import fs from "fs";
import path from "path";
import clipboard from "clipboardy";
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


export function getSelectedProjectFolder(config, { index, term }) {
    const hasSearchTerm = Boolean(term);
    const hasIndexSpecified = Boolean(index) && !hasSearchTerm;
    if (!Boolean(config.last) && !hasIndexSpecified && !hasSearchTerm) {
        console.log("Need an index or a search term (q 'term'), list the projects first");
        return;
    }

    if (Boolean(config.last) && !hasIndexSpecified && !hasSearchTerm) {
        return config.last;
    }

    let folder = null;
    if (hasSearchTerm) {
        const result = config.projects.find(p => p.name.toLocaleLowerCase().includes(term));
        if (!Boolean(result)) {
            return;
        }
        folder = buildPathFromConfig(result, config);
    } else {
        folder = buildPathFromConfig(config.projects[index], config);
    }

    config.last = folder;
    saveConfig(config);

    return folder;
}

export function buildPathFromConfig(project, config) {
    return path.join(`${config.codefolders}`, project.name);
}

export function folderPathToClipboard(folder, includeCd = false) {
    const cdCommand = `${includeCd ? 'cd ' : ''}${folder}/`;
    clipboard.writeSync(cdCommand);
    console.log(`command: "${cdCommand}" copied to clipboard.`);
}

export function isValidQueryParam(option) {
    return ["q", "query"].includes(option);
}