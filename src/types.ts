
export interface Config {
    codefolders: string,
    lastRefreshed: Date,
    projects: Project[],
    editor: string,
    last: string | null,
}

export interface Project {
    name: string,
    lastModified: string | Date,
    index: number,
}