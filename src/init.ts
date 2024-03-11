import fs from "fs";
import os from "os";
import path, { join } from "path";
import { getConfigFileName, saveConfig } from "./helpers.js";
import cproc from "child_process";

export function isInit() {
    if (!fs.existsSync(getConfigFileName())) {
        console.log(`${getConfigFileName()} not found, init config...`);
        return false;
    }

    return true;
}

export function init(folders: string[]) {
    const config = createBaseConfig(folders);
    for (const folder of config.codefolders) {
        const projects = fs.readdirSync(folder, { withFileTypes: true })
            .filter(obj => {
                return obj.isDirectory() && fs.existsSync(path.join(folder, obj.name, ".git"));
            })
            .map(dir => {
                const gitDate = cproc.execSync(`cd ${path.join(folder, dir.name)} &&` + ' git log -1').toString();
                const m = gitDate.match(/Date:\s+(.+2\d{3}?)/);
                const date = new Date(m ? m[1] : 0);
                return {
                    name: dir.name,
                    lastModified: date,
                };

            });

        projects.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

        config.projects = [...(config.projects ?? []), ...projects.map((p, index) => {
            return {
                index,
                codeFolder: folder,
                ...p,
            };
        })];
    }

    saveConfig(config);
    console.log(`found ${config.projects.length} projects in ${config.codefolders, join(', ')} folder\nconfig file created.\nrun \`l\` command to list the projects.`);
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

function createBaseConfig(folders: string[]): Config {
    const codefolders = folders ?? [path.join(os.homedir(), "code/")];
    codefolders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            console.error(`folder ${folder} does not exist, exiting.`);
            process.exit(1);
        }
    });
    return { codefolders: codefolders, projects: [], editor: "code", lastRefreshed: new Date(), last: null };
}