# Ntrallazzu

A cli utility to manage sideprojects, `'ntrallazzu` is the sicilian word to express complex affairs, if you say that someone's got `'ntrallazzi` you are saying that he is busy doing something complex, perfect name to manage your ntrallazzi.

This project has no dependencies, only good old plain javascript.

![render1690312286438](https://github.com/vikkio88/ntrallazzu/assets/248805/8e1a7c71-1054-479a-a6d7-da87f0029f09)

```
npm i -g ntrallazzu
```

Init your source folder
```
ntrz ~/code
```

then show your projects
```
ntrz l
```

open one in your favourite editor
```
ntrz o 3
```

open again the last one you were working on
```
ntrz o
```


## TODO
- [ ] Implement aliases `l` == `ls` == `list`
- [x] Filter folders only having .git on
- [ ] Make editor choosable from list
- [x] Order folders by lastmodified date
- [ ] Parse recognise folders project language
- [ ] Create new project
