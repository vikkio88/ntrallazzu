import { getConfigFileName } from "./helpers.js";

export function printHelp() {
    console.log(`
    Ntrallazzu - Help
    ntrz - ntrallazzu
    source: https://github.com/vikkio88/ntrallazzu
    a small utility to launch/manage your projects folders.

    Actions:
    . ntrz l
        this command will list your projects
        ntrz l s - will show a simpler list (omitting the date)
        ntrz l q TERM -  will show a filtered list with projects containing TERM
                         and it will copy the first result folder to your clipboard

    . ntrz o [index] [q TERM]
        this command will open your project index is the order given by the list.
        ntrz o without any index param will open the last project you were working on
        - this also copies to your clipboard the command to switch to the project folder
    
    . ntrz cd [index] [q TERM]
        this command will copy your project folder to your clipboard (the index is the order given by the list).
        ntrz f without any index param will copy the folder of the last project you were working on

    . ntrz r
        this command will refresh the list

    . ntrz rm
        this command will remove the config file and allow you to restart fresh
    
    . ntrz h
        will print this help
    
    . ntrz v
        will print the version
    
    . ntrz i
        will print config info
    
    
    if the config file (${getConfigFileName()}) does not exist yet the script will use the arg as folder to setup the project

    example

    ntrz ~/code [../otherfolder, ...]

    will index all the source/projects in the ~/code folder, ordering them by date (last commit).
    `);
}