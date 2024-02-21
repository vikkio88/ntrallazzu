import cproc from "child_process";
import process from "process";
import fs from "fs";
import { buildPathFromConfig, folderPathToClipboard, getConfigFileName, getSelectedProjectFolder, isValidQueryParam, saveConfig, } from "./helpers.js";
import { init } from "./init.js";
import v from "./version.cjs";
import { formatDistance } from "date-fns";

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTimeAgo(dateStr) {
    return formatDistance(new Date(dateStr), new Date(), { addSuffix: true });
}

/** 
 * @param {{codefolders: String, projects: {name:string, lastModified:Date}[], editor: String, lastRefreshed: Date|String}} config a Config Object
 */
export function list(config, [option, term]) {
    console.log(`Projects in ${config.codefolders}/:`);
    console.log(`\tlast update - ${formatTimeAgo(config.lastRefreshed)} ${formatDate(config.lastRefreshed)}\n\n`);
    const maxLength = String(config.projects.length - 1).length;
    let projects = config.projects;

    if (isValidQueryParam(option) && !Boolean(term)) {
        console.error("No search term specified");
        process.exit(1);
    }

    if (isValidQueryParam(option)) {
        projects = projects.filter(p => p.name.toLocaleLowerCase().includes(term));
    }

    if (projects.length < 1) {
        console.log("\tNo projects found.\n\n");
        return;
    }

    for (const i in projects) {
        const p = projects[i];
        const lastModified = new Date(p.lastModified);
        const paddedIndex = String(p.index).padEnd(maxLength, ' ');
        const line = `${paddedIndex} - ${p.name}${["simple", "s"].includes(option) ? '' : `\n\t date:${formatDate(lastModified)}\n`}`;
        console.log(line);
    }

    // If you filtered and there are any projects that match copy the first folder
    if (projects.length > 0 && isValidQueryParam(option)) {
        folderPathToClipboard(buildPathFromConfig(projects[0], config), true);
    }
}

/** 
 * @param {{codefolders: String, projects: string[], editor: String}} config a Config Object
 */
export function refresh(config) {
    rm();
    let lastOpened = null;
    if (Boolean(config.last)) {
        lastOpened = `${config.last}`;
    }
    const newConfig = init(config.codefolders);

    console.log("refreshed project config.");
    if (Boolean(lastOpened) && fs.existsSync(lastOpened)) {
        console.log(`restoring last opened folder "${lastOpened}"`);
        newConfig.last = lastOpened;
        saveConfig(newConfig);
    }
}

/** 
 * @param {{codefolders: String, projects: {name:string, lastModified:Date}[], editor: String, lastRefreshed: Date}} config a Config Object
 * @param {[]any} args args
 */
export function open(config, [option, term]) {
    if (isValidQueryParam(option) && !Boolean(term)) {
        console.error("No search term specified");
        process.exit(1);
    }

    const searchOpts = { index: isValidQueryParam(option) ? null : option, term: term };
    const selectedProjectFolder = getSelectedProjectFolder(config, searchOpts);

    if (!Boolean(selectedProjectFolder)) {
        console.log(Boolean(term) ? `No projects found with search term "${term}", maybe refresh 'r' or list 'l'?` : 'no folder to open... try `l` or `r` to refresh?');
        process.exit(1);
    }

    console.log(`opening ${selectedProjectFolder}\n\n`);
    folderPathToClipboard(selectedProjectFolder);
    cproc.exec(`${config.editor} ${selectedProjectFolder}/`);
}

/** 
 * @param {{codefolders: String, projects: {name:string, lastModified:Date}[], editor: String, lastRefreshed: Date}} config a Config Object
 * @param {[]any} args args
 */
export function cd(config, [option, term]) {
    if (isValidQueryParam(option) && !Boolean(term)) {
        console.error("No search term specified");
        process.exit(1);
    }

    const searchOpts = { index: isValidQueryParam(option) ? null : option, term: term };
    const selectedProjectFolder = getSelectedProjectFolder(config, searchOpts);
    if (!Boolean(selectedProjectFolder)) {
        console.log(Boolean(term) ? `No projects found with search term "${term}", maybe refresh 'r' or list 'l'?` : 'no folder to open... try `l` or `r` to refresh?');
        process.exit(1);
    }
    folderPathToClipboard(selectedProjectFolder, true);
}

/** 
 * @param {{codefolders: String, projects: string[], editor: String}} config a Config Object
 */
export function rm(config) {
    const filename = getConfigFileName();
    fs.rmSync(filename);
    console.log("removed config file");
}

export function version() {
    console.log(`ntrallazzu - ntrz - version: ${v()}`);
}

export function info(config) {
    console.log(
        `
        last project opened: ${config.last ?? "nothing yet..."}

        folder: ${config.codefolders}
        last update: ${formatTimeAgo(config.lastRefreshed)} - ${formatDate(config.lastRefreshed)}

        `
    );
}