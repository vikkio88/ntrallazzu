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
