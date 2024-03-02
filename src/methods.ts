import cproc from "child_process";
import process from "process";
import fs from "fs";
import {
    buildPathFromConfig, folderPathToClipboard, getConfigFileName,
    getSelectedProjectFolder, isValidQueryParam, saveConfig,
} from "./helpers.js";
import { init } from "./init.js";
import v from "./version.cjs";
import { formatDistance } from "date-fns";

function formatDate(dateStr: string | Date) {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTimeAgo(date: string | Date) {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

export function list(config: Config, [option, term]: string[]) {
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

export function refresh(config: Config) {
    rm(config);
    let lastOpened: string | null = null;
    if (Boolean(config.last)) {
        lastOpened = `${config.last}`;
    }
    const newConfig = init(config.codefolders);

    console.log("refreshed project config.");
    if (lastOpened != null && fs.existsSync(lastOpened)) {
        console.log(`restoring last opened folder "${lastOpened}"`);
        newConfig.last = lastOpened;
        saveConfig(newConfig);
    }
}


export function open(config: Config, [option, term]: string[]) {
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

export function cd(config: Config, [option, term]: string[]) {
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

export function rm(config: Config) {
    const filename = getConfigFileName();
    fs.rmSync(filename);
    console.log("removed config file");
}

export function version() {
    console.log(`ntrallazzu - ntrz - version: ${v()}`);
}

export function info(config: Config) {
    console.log(
        `
        last project opened: ${config.last ?? "nothing yet..."}

        folder: ${config.codefolders}
        last update: ${formatTimeAgo(config.lastRefreshed)} - ${formatDate(config.lastRefreshed)}

        `
    );
}