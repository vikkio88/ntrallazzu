import cproc from "child_process";
import process from "process";
import fs from "fs";
import path from "path";
import { getConfigFileName, saveConfig } from "./helpers.js";
import { init } from "./init.js";
import v from "./version.cjs";

function formatDate(date) {
    return date.toLocaleString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** 
 * @param {{codefolders: String, projects: {name:string, lastModified:Date}[], editor: String, lastRefreshed: Date|String}} config a Config Object
 */
export function list(config, [option, term]) {
    console.log(`Projects in ${config.codefolders}/:`);
    console.log(`\tlast update - ${formatDate(new Date(config.lastRefreshed))}\n\n`);
    const maxLength = String(config.projects.length - 1).length;
    let projects = config.projects;

    if (["q", "query"].includes(option) && !Boolean(term)) {
        console.error("No search term specified");
        process.exit(1);
    }

    if (["q", "query"].includes(option)) {
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
}

/** 
 * @param {{codefolders: String, projects: string[], editor: String}} config a Config Object
 */
export function refresh(config) {
    rm();
    init(config.codefolders);
    console.log("refreshed");
}

/** 
 * @param {{codefolders: String, projects: {name:string, lastModified:Date}[], editor: String, lastRefreshed: Date}} config a Config Object
 * @param {[]any} args args
 */
export function open(config, [index]) {
    const hasIndexSpecified = !(index === undefined);
    if (!Boolean(config.last) && !hasIndexSpecified) {
        console.log("Need an index, list the projects first");
        return;
    }

    const selectedProjectFolder = (!hasIndexSpecified && Boolean(config.last)) ? config.last : path.join(`${config.codefolders}`, config.projects[index].name);
    config.last = selectedProjectFolder;
    saveConfig(config);

    console.log(`opening ${selectedProjectFolder}\n\n`);
    cproc.exec(`${config.editor} ${selectedProjectFolder}/`);
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
        last project open: ${config.last ?? "NOTHING"}

        folder: ${config.codefolders}
        last update: ${config.lastRefreshed}

        `
    );
}