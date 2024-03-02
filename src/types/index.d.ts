
type Config = {
    codefolders: string,
    lastRefreshed: Date,
    projects: Project[],
    editor: string,
    last: string | null,
}

type Project = {
    name: string,
    lastModified: string | Date,
    index: number,
}