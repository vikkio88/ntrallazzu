import os from "os";
import fs from "fs";
import path from "path";
import clipboard from "clipboardy";
import { CONF_FILENAME } from "./conf.js";
// import { closest } from "fastest-levenshtein";

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
        // const names: Record<string, Project> = {};
        let result = config.projects.find(p => {
            const name = p.name.toLocaleLowerCase();
            // names[name] = p;
            return name.includes(term);
        });

        // if (!result) {
        //     console.log(`\tcould not find a match for '${term}' getting the closest match.`)
        //     const res = closest(term, Object.keys(names))
        //     result = names[res];
        // }

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
    const result = path.join(`${project.codeFolder}`, project.name);
    if (!fs.existsSync(result)) {
        console.log(`Folder ${result} does not exist.`);
        process.exit(1);
    }
    return result
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