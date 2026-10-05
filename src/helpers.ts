import clipboard from "clipboardy";
import fs from "fs";
import os from "os";
import path from "path";
import picocolors from "picocolors";
import { CONF_FILENAME } from "./conf.js";
// import { closest } from "fastest-levenshtein";

export function getConfigFileName(): string {
  return path.join(os.homedir(), CONF_FILENAME);
}

export function saveConfig(config: Config) {
  config.lastRefreshed = new Date();
  fs.writeFileSync(getConfigFileName(), JSON.stringify(config, null, 2));
}

export function getSelectedProjectFolder(
  config: Config,
  { term },
): string | null {
  const hasSearchTerm = Boolean(term);
  if (!Boolean(config.last) && !hasSearchTerm) {
    l("Need an index or a search term (q 'term'), list the projects first");
    return null;
  }

  if (Boolean(config.last) && !hasSearchTerm) {
    return config.last;
  }

  let folder: string | null = null;
  if (hasSearchTerm) {
    // const names: Record<string, Project> = {};
    let result = config.projects.find((p) => {
      const name = p.name.toLocaleLowerCase();
      // names[name] = p;
      return name.includes(term);
    });

    // if (!result) {
    //     l(`\tcould not find a match for '${term}' getting the closest match.`)
    //     const res = closest(term, Object.keys(names))
    //     result = names[res];
    // }

    if (!result) {
      return null;
    }

    folder = buildPathFromConfig(result);
  }

  config.last = folder ?? null;
  saveConfig(config);

  return folder;
}

export function buildPathFromConfig(project: Project): string {
  const result = path.join(`${project.codeFolder}`, project.name);
  if (!fs.existsSync(result)) {
    l(`Folder ${result} does not exist.`);
    process.exit(1);
  }
  return result;
}

export function folderPathToClipboard(
  folder: string | null,
  includeCd: boolean = false,
  toClipboard: boolean = true,
) {
  if (!folder) {
    l(`${col.cr("Error:")} folder is empty, could not copy to clipboard`);
    return;
  }
  const cdCommand = `${includeCd ? "cd " : ""}${folder}/`;
  try {
    if (toClipboard) clipboard.writeSync(cdCommand);
    l(`${col.b(includeCd ? "command" : "directory")} "${col.cg(cdCommand)}"\n`);

    if (toClipboard) l(`\n\n${col.i("copied to clipboard")}`);
  } catch (_) {
    l(`${col.cr("Error:")} could not copy to clipboard.`);
  }
}

const GIT_REMOTE_REGEXPS = [
  {
    regexp: /url = git@github\.com:(.+?)\/(.+?)\.git/,
    base: "https://github.com",
  },
  {
    regexp: /url = git@bitbucket\.org:([^/]+)\/([^/]+)\.git/,
    base: "https://bitbucket.org",
  },
  {
    regexp: /url = ssh:\/\/git@codeberg\.org\/(.+?)\/(.+?)\.git/,
    base: "https://codeberg.org",
  },
  {
    regexp: /url = git@gitlab\.com:(.+?)\/(.+?)\.git/,
    base: "https://gitlab.com",
  },
];

export function getProjectUrl(projectFolder: string | null) {
  if (!projectFolder) {
    return null;
  }
  const gitConfigFile = path.join(projectFolder, ".git", "config");
  if (!fs.existsSync(gitConfigFile)) {
    return null;
  }
  const gitConfig = fs.readFileSync(gitConfigFile).toString();
  for (const { regexp, base } of GIT_REMOTE_REGEXPS) {
    const matches = gitConfig.match(regexp);
    if (matches && matches.length >= 3) {
      return `${base}/${matches[1]}/${matches[2]}`;
    }
  }
  return null;
}

export const SHELL_WRAPPER_MARKER_START =
  "# >>> ntrallazzu (ntrz) shell integration >>>";
export const SHELL_WRAPPER_MARKER_END =
  "# <<< ntrallazzu (ntrz) shell integration <<<";

export function buildShellWrapperSnippet(): string {
  return `${SHELL_WRAPPER_MARKER_START}
ntrz() {
  if [ "$1" = "cd" ]; then
    local target
    target=$(command ntrz "$@" --raw)
    if [ -n "$target" ]; then
      cd "$target"
    fi
  else
    command ntrz "$@"
  fi
}
${SHELL_WRAPPER_MARKER_END}
`;
}

export function getShellRcFileName(
  shell: string | undefined,
  home: string = os.homedir(),
): string | null {
  if (!shell) return null;
  const shellName = path.basename(shell);
  if (shellName === "zsh") return path.join(home, ".zshrc");
  if (shellName === "bash") return path.join(home, ".bashrc");
  return null;
}

export function isShellWrapperInstalled(content: string): boolean {
  return content.includes(SHELL_WRAPPER_MARKER_START);
}

export function isValidQueryParam(option: string): boolean {
  return ["q", "query"].includes(option);
}

export function l(message: string) {
  console.log(message);
}

export const col = {
  cg: picocolors.green,
  cr: picocolors.red,
  b: picocolors.bold,
  i: picocolors.italic,
};
