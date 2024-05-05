# Ntrallazzu

A cli utility to manage sideprojects, `'ntrallazzu (intrallazzu)` is the sicilian word to express complex affairs, if you say that someone's got `'ntrallazzi (intrallazzi)` you are saying that he is busy doing something complex, perfect name to manage your **ntrallazzi**.

This project is written in Typescript just because why not.

![render1690312286438](https://github.com/vikkio88/ntrallazzu/assets/248805/8e1a7c71-1054-479a-a6d7-da87f0029f09)

```
npm i -g ntrallazzu
```

Init your source folder
```
ntrz ~/code [.. any/other /folder /path/]
```

then show your projects
```
ntrz l
```

open one in your favourite editor
```
ntrz o [somestring]
```

open again the last one you were working on
```
ntrz o
```

you can also use a `query` feature in most commands
```
ntrz o ntral
```
this will open the code folder with the name closer to `ntral` in my case will open `~/code/ntrallazzu`, in case of multiple match will open the latest opened.


for more info examples
```
ntrz h
```

```
    Actions:
    . ntrz l
        alias: list, ls
        this command will list your projects
        ntrz l s - will show a simpler list (omitting the date)
        ntrz l q TERM -  will show a filtered list with projects containing TERM
                         and it will copy the first result folder to your clipboard
    . ntrz o [TERM] (--no-cp)
        alias: open, --open
        this command will open your project last opened project.
        "ntrz o" without any index param will open the last project you were working on
        - this also copies to your clipboard the command to switch to the project folder
        if you specify a TERM it will open the project that closest matches that string.
        - if --no-cp is specified (with or without the search term), it will not copy
            the folder to the clipboard. (alias: '-nocp', '-ncp', '--ncp')
    
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
```

## TODO
- [x] Implement aliases `l` == `ls` == `list`
- [x] Filter folders only having .git on
- [ ] Make editor choosable from list
- [x] Order folders by lastmodified date
- [ ] Parse recognise folders project language
- [ ] Create new project
- [x] Add time-ago to check how far back you refreshed the project
- [ ] suggest refresh if it was refreshed loads of time ago
- [x] persist last opened through refresh if the folder exists (this will allow auto-refresh maybe?)
- [x] Open project by abbreviation not only index `ntrz o q xxx`
- [x] Support multiple folders
