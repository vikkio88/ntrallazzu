import fs from "fs";
import os from "os";
import path from "path";
import { getConfigFileName, saveConfig } from "./helpers.js";
import cproc from "child_process";

export function isInit() {
    if (!fs.existsSync(getConfigFileName())) {
        console.log(`${getConfigFileName()} not found, init config...`);
        return false;
    }

    return true;
}

export function init(folder: string) {
    const config = createBaseConfig(folder);
    const projects = fs.readdirSync(config.codefolders, { withFileTypes: true })
        .filter(obj => {
            return obj.isDirectory() && fs.existsSync(path.join(config.codefolders, obj.name, ".git"));
        })
        .map(dir => {
            const gitDate = cproc.execSync(`cd ${path.join(config.codefolders, dir.name)} &&` + ' git log -1').toString();
            const m = gitDate.match(/Date:\s+(.+2\d{3}?)/);
            const date = new Date(m ? m[1] : 0);
            return {
                name: dir.name,
                lastModified: date,
            };

        });

    projects.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

    config.projects = projects.map((p, index) => {
        return {
            index,
            ...p,
        };
    });

    saveConfig(config);
    console.log(`found ${projects.length} projects in ${config.codefolders} folder\nconfig file created.\nrun \`l\` command to list the projects.`);
    return config;
}

export function readConfig(): Config | null {
    const data = fs.readFileSync(getConfigFileName());

    let config = null;
    try {
        config = JSON.parse(data.toString());
    } catch {
        console.error(`Cannot parse ${getConfigFileName()} correctly.`);
        process.exit(1);
    }

    return config;
}

function createBaseConfig(folder: string): Config {
    const codefolders = folder ?? path.join(os.homedir(), "code/");
    if (!fs.existsSync(folder)) {
        console.error(`folder ${folder} does not exist, exiting.`);
        process.exit(1);
    }
    return { codefolders: codefolders, projects: [], editor: "code", lastRefreshed: new Date(), last: null };
}