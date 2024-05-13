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
        "ntrz o" without any param will open the last project you were working on.
        - This also copies to your clipboard the command to switch to the project folder.
        If you specify a TERM, it will open the project that closest matches that string.
        - If --no-cp is specified (with or without the search term), it will not copy
            the folder to the clipboard. (alias: '-nocp', '-ncp', '--ncp')

    . ntrz cd [TERM]
        This command will copy your project folder to your clipboard
        (the index is the order given by the list).
        "ntrz cd" without any param will copy the folder of the last project you were working on.
        If you specify a TERM, it will open the project that closest matches that string.
    
    . ntrz url [TERM] (--no-cp)
        alias: u
        This command will print the github url of your last opened project.
        "ntrz u" without any param will print the url of the last project you were working on.
        - This also copies to your clipboard the same url.
        If you specify a TERM, it will open the project that closest matches that string.
        - If --no-cp is specified (with or without the search term), it will not copy
            the folder to the clipboard. (alias: '-nocp', '-ncp', '--ncp')

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
