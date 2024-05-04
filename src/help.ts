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
        this command will list your projects
        ntrz l s - will show a simpler list (omitting the date)
        ntrz l q TERM -  will show a filtered list with projects containing TERM
                         and it will copy the first result folder to your clipboard
    . ntrz o [TERM]
        alias: open, --open
        this command will open your project last opened project.
        "ntrz o" without any index param will open the last project you were working on
        - this also copies to your clipboard the command to switch to the project folder
        if you specify a TERM it will open the project that closest matches that string.
    
    . ntrz cd [TERM]
        this command will copy your project folder to your clipboard (the index is the order given by the list).
        "ntrz cd" without any index param will copy the folder of the last project you were working on
        if you specify a TERM it will open the project that closest matches that string.

    . ntrz r
        alias: refresh
        this command will refresh the list

    . ntrz rm
        this command will remove the config file and allow you to restart fresh
    
    . ntrz h
        alias: help, -h, --help
        will print this help
    
    . ntrz v
        alias: version, --v, --version
        will print the version
    
    . ntrz i
        alias: info
        will print config info
    
    
    if the config file (${getConfigFileName()}) does not exist yet the script will use the arg as folder to setup the project

    example

    ntrz ~/code [../otherfolder, ...]

    will index all the source/projects in the ~/code folder, ordering them by date (last commit).
    `);
}