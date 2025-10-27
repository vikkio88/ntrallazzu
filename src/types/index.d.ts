type Config = {
  codefolders: string[];
  lastRefreshed: Date;
  projects: Project[];
  editor: string;
  last: string | null;
  autoCopy?: boolean;
};

type Project = {
  name: string;
  codeFolder: string;
  lastModified: string | Date;
  index: number;
};
