import os from "os";
import fs from "fs";
import path from "path";
import clipboard from "clipboardy";
import { CONF_FILENAME } from "./conf.js";

export function getConfigFileName(): string {
    return path.join(os.homedir(), CONF_FILENAME);
}

export function saveConfig(config: Config) {
    config.lastRefreshed = new Date();
    fs.writeFileSync(getConfigFileName(), JSON.stringify(config, null, 2));
}


export function getSelectedProjectFolder(config: Config, { term }): string | null {
    const hasSearchTerm = Boolean(term);
    if (!Boolean(config.last) && !hasSearchTerm) {
        console.log("Need an index or a search term (q 'term'), list the projects first");
        return null;
    }

    if (Boolean(config.last) && !hasSearchTerm) {
        return config.last;
    }

    let folder: string | null = null;
    if (hasSearchTerm) {
        const result = config.projects.find(p => p.name.toLocaleLowerCase().includes(term));
        if (!result) {
            return null;
        }
        folder = buildPathFromConfig(result);

    }

    config.last = folder ?? null;
    saveConfig(config);

    return folder;
}

export function buildPathFromConfig(project: Project): string {
    return path.join(`${project.codeFolder}`, project.name);
}

export function folderPathToClipboard(folder: string | null, includeCd: boolean = false) {
    if (!folder) {
        console.log("folder is empty, could not copy to clipboard");
        return;
    }
    const cdCommand = `${includeCd ? 'cd ' : ''}${folder}/`;
    clipboard.writeSync(cdCommand);
    console.log(`command: "${cdCommand}" copied to clipboard.`);
}

export function isValidQueryParam(option: string): boolean {
    return ["q", "query"].includes(option);
}