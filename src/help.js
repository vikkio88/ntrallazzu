import { getConfigFileName } from "./helpers.js";

export function printHelp() {
    console.log(`
    Ntrallazzu - Help
    ntrz - ntrallazzu
    a small utility to launch/manage your sideprojects.

    Actions:
    . ntrz l
        this command will list your projects
        ntrz l s - will show a simpler list (omitting the date)
        ntrz l q TERM -  will show a filtered list with projects containing TERM

    . ntrz o [index]
        this command will open your project index is the order given by the list.
        ntrz o without any index param will open the last project you were working on

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

    ntrz ~/code

    will index all the source/projects in the ~/code folder, ordering them by date.
    `);
}