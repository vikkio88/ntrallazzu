import { getConfigFileName } from "./helpers.js";

export function printHelp() {
    console.log(`
    Ntrallazzu - Help
    ntrz - ntrallazzu
    source: https://github.com/vikkio88/ntrallazzu
    a small utility to launch/manage your projects folders.

    Actions:

    . ntrz l
        alias: list, ls
        This command will list your projects.
        ntrz l s - will show a simpler list (omitting the date).
        ntrz l q TERM - will show a filtered list with projects containing TERM
                         and it will copy the first result folder to your clipboard.

    . ntrz o [TERM] (--no-cp)
        alias: open, --open
        This command will open your last opened project.
        "ntrz o" without any index param will open the last project you were working on.
        - This also copies to your clipboard the command to switch to the project folder.
        If you specify a TERM, it will open the project that closest matches that string.
        - If --no-cp is specified (with or without the search term), it will not copy
            the folder to the clipboard. (alias: '-nocp', '-ncp', '--ncp')

    . ntrz cd [TERM]
        This command will copy your project folder to your clipboard
        (the index is the order given by the list).
        "ntrz cd" without any index param will copy the folder of the last project you were working on.
        If you specify a TERM, it will open the project that closest matches that string.

    . ntrz r
        alias: refresh
        This command will refresh the list.

    . ntrz rm
        This command will remove the config file and allow you to restart fresh.

    . ntrz h
        alias: help, -h, --help
        Will print this help.

    . ntrz v
        alias: version, --v, --version
        Will print the version.

    . ntrz i
        alias: info
        Will print config info.
    
    If the config file (${getConfigFileName()}) does not exist yet, the script will use the argument(s) as a folder(s) to set up ntrallazzu.

    Example:
    
    ntrz ~/code [../otherfolder, ...]
    
    This will index all the source folders in the ~/code folder (and any other folder specified), ordering them by date (last commit).
    `);
}
