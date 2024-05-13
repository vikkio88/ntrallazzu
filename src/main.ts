import { printHelp } from "./help.js";
import { isInit, init, readConfig } from "./init.js";
import { list, refresh, open, rm, version, info, cd, url } from "./methods.js";

const METHODS = {
    LIST: {
        func: list
    },
    REFRESH: {
        func: refresh
    },
    OPEN: {
        func: open
    },
    CHANGE_DIRECTORY: {
        func: cd
    },
    REMOVE: {
        func: rm
    },
    HELP: {
        func: printHelp
    },
    VERSION: {
        func: version
    },
    INFO: {
        func: info
    },
    URL: {
        func: url
    }
}

const VALID_ARGS = {
    'l': METHODS.LIST,
    'list': METHODS.LIST,
    'ls': METHODS.LIST,
    'r': METHODS.REFRESH,
    'refresh': METHODS.REFRESH,
    'o': METHODS.OPEN,
    'open': METHODS.OPEN,
    '--open': METHODS.OPEN,
    'cd': METHODS.CHANGE_DIRECTORY,
    'rm': METHODS.REMOVE,
    'remove': METHODS.REMOVE,
    'url': METHODS.URL,
    'u': METHODS.URL,
    'help': METHODS.HELP,
    '-h': METHODS.HELP,
    '--help': METHODS.HELP,
    'h': METHODS.HELP,
    'v': METHODS.VERSION,
    '-v': METHODS.VERSION,
    '--version': METHODS.VERSION,
    'version': METHODS.VERSION,
    'i': METHODS.INFO,
    'info': METHODS.INFO,
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