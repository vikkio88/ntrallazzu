import { printHelp } from "./help.js";
import { isInit, init, readConfig } from "./init.js";
import { list, refresh, open, rm, version, info, cd } from "./methods.js";

const VALID_ARGS = {
    'l': {
        name: "List",
        description: "List projects",
        func: list
    },
    'r': {
        name: "Refresh",
        description: "Refresh projects list",
        func: refresh
    },
    'o': {
        name: "Open",
        description: "Open project with index, if no index specified will open the latest.",
        func: open
    },
    'cd': {
        name: "Change Directory",
        description: "Navigate to project folder, if no index specified will open the latest.",
        func: cd
    },
    'rm': {
        name: "Remove",
        description: "Remove config file",
        func: rm
    },
    'h': {
        name: "Help",
        description: "Print Help",
        func: printHelp
    },
    'v': {
        name: "Version",
        description: "Print version",
        func: version
    },
    'i': {
        name: "Info",
        description: "Print Info",
        func: info
    },
};

export function main(args: string[]) {
    if (Array.isArray(args) && args.length < 1) {
        printHelp();
        return;
    }

    if (!isInit()) {
        init(args);
        return;
    }

    const config = readConfig();


    if (!Object.keys(VALID_ARGS).includes(args[0])) {
        printHelp();
        return;
    }


    if (Boolean(VALID_ARGS[args[0]])) {
        VALID_ARGS[args[0]].func(config, args.slice(1));
        process.exit(0);
    }


    printHelp();
}