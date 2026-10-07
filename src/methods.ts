import cproc from "child_process";
import process from "process";
import fs from "fs";
import {
  buildPathFromConfig,
  folderPathToClipboard,
  getConfigFileName,
  getSelectedProjectFolder as findProjectFolderFromArgs,
  isValidQueryParam,
  saveConfig,
  getProjectUrl,
  getShellRcFileName,
  buildShellWrapperSnippet,
  isShellWrapperInstalled,
  l,
  col,
} from "./helpers.js";
import { init } from "./init.js";
import v from "./version.cjs";
import { formatDistance } from "date-fns";
import { isParam, parseOptions, OPTIONS } from "./options.js";
import clipboard from "clipboardy";

function formatDate(dateStr: string | Date) {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTimeAgo(date: string | Date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

export function list(config: Config, [option, term]: string[]) {
  l(`Projects in ${col.b(config.codefolders.join(", "))}/:`);
  l(
    `\t${col.b("last update")} - ${formatTimeAgo(
      config.lastRefreshed,
    )} ${formatDate(config.lastRefreshed)}\n\n`,
  );
  const maxLength = String(config.projects.length - 1).length;
  let projects = config.projects;

  if (isValidQueryParam(option) && !Boolean(term)) {
    console.error("No search term specified");
    process.exit(1);
  }

  if (isValidQueryParam(option)) {
    projects = projects.filter((p) =>
      p.name.toLocaleLowerCase().includes(term),
    );
  }

  if (projects.length < 1) {
    l("\tNo projects found.\n\n");
    return;
  }

  for (const i in projects) {
    const p = projects[i];
    const lastModified = new Date(p.lastModified);
    const paddedIndex = String(p.index + 1).padEnd(maxLength, " ");
    // TODO: check about this simple option
    const line = `${paddedIndex} - ${col.cg(p.name)}${
      ["simple", "s"].includes(option)
        ? ""
        : `\n\t ${col.b("date")}:${formatDate(lastModified)}`
    }`;
    l(`\t ${col.b("folder")}: ${p.codeFolder}\n`);
    l(line);
  }

  // If you filtered and there are any projects that match copy the first folder
  if (projects.length > 0 && isValidQueryParam(option)) {
    folderPathToClipboard(buildPathFromConfig(projects[0]), true);
  }
}

export function refresh(config: Config) {
  rm(config);
  let lastOpened: string | null = null;
  let autoCopy: boolean | undefined = undefined;
  if (Boolean(config.last)) {
    lastOpened = `${config.last}`;
  }
  const newConfig = init(config.codefolders);

  l(col.cg("refreshed project config."));
  newConfig.autoCopy = autoCopy;

  if (lastOpened != null && fs.existsSync(lastOpened)) {
    l(`restoring last opened folder "${col.b(lastOpened)}"`);
    newConfig.last = lastOpened;
  }

  if (newConfig.editor !== config.editor) {
    l(
      `restoring editor setting as it is not the default editor "${col.b(config.editor)}"`,
    );
    newConfig.editor = config.editor;
  }

  saveConfig(newConfig);
}

export async function open(config: Config, [term, ...others]: string[]) {
  const opts = parseOptions([term, ...others]);
  const searchOpts = { term: isParam(term) ? null : term };
  const selectedProjectFolder = await findProjectFolderFromArgs(
    config,
    searchOpts,
  );

  if (!Boolean(selectedProjectFolder)) {
    l(
      Boolean(searchOpts.term)
        ? `No projects found with search term "${term}", maybe refresh 'r' or list 'l'?`
        : "no folder to open... try `l` or `r` to refresh?",
    );
    process.exit(1);
  }

  if (config.autoCopy && !opts.NO_COPY) {
    folderPathToClipboard(selectedProjectFolder);
  }

  if (opts.UPDATE) {
    l(col.b("Update Requested:"));
    l(col.i(`Running GIT PULL in '${selectedProjectFolder}'...`));
    cproc.exec(`cd ${selectedProjectFolder}/ && git pull`);
    l(col.cg("Done.\n\n"));
  }

  if (opts.NO_OPEN) {
    l(`Selected "${col.cr("NO OPEN")}", the project will not be opened.`);
    process.exit(1);
  }

  l(
    `${col.b("opening")} "${col.cg(selectedProjectFolder)}" with ${col.b(
      config.editor,
    )}.\n`,
  );
  cproc.exec(`${config.editor} ${selectedProjectFolder}/`);
}

export async function cd(config: Config, args: string[]) {
  const opts = parseOptions(args, { RAW: OPTIONS.RAW });
  const term = args.find((arg) => !isParam(arg));
  const searchOpts = { term: term };
  const selectedProjectFolder = await findProjectFolderFromArgs(
    config,
    searchOpts,
  );
  if (!Boolean(selectedProjectFolder)) {
    if (opts.RAW) process.exit(1);
    l(
      Boolean(term)
        ? `No projects found with search term "${term}", maybe refresh 'r' or list 'l'?`
        : "no folder to open... try `l` or `r` to refresh?",
    );
    process.exit(1);
  }

  if (opts.RAW) {
    console.log(`${selectedProjectFolder}/`);
    return;
  }

  folderPathToClipboard(selectedProjectFolder, true, config.autoCopy);
}

export function install(
  _config?: Config,
  _args: string[] = [],
  overrides: { shell?: string; rcFile?: string } = {},
) {
  const shell = overrides.shell ?? process.env.SHELL;
  const rcFile = overrides.rcFile ?? getShellRcFileName(shell);

  if (!rcFile) {
    l(
      `${col.cr("Error:")} unsupported shell "${
        shell ?? "unknown"
      }", only zsh and bash are supported.`,
    );
    process.exit(1);
  }

  const existingContent = fs.existsSync(rcFile)
    ? fs.readFileSync(rcFile).toString()
    : "";

  if (isShellWrapperInstalled(existingContent)) {
    l(
      `${col.cg("Already installed")} in "${col.b(
        rcFile,
      )}", nothing to do.\nRun \`${col.b(
        `source ${rcFile}`,
      )}\` or restart your terminal if "ntrz cd" is still not changing directory.`,
    );
    return;
  }

  fs.appendFileSync(rcFile, `\n${buildShellWrapperSnippet()}`);
  l(
    `${col.cg("Installed")} the shell integration in "${col.b(
      rcFile,
    )}".\nRun \`${col.b(
      `source ${rcFile}`,
    )}\` or restart your terminal, then "ntrz cd [TERM]" will change your current shell's directory.`,
  );
}

export function rm(config: Config) {
  const filename = getConfigFileName();
  fs.rmSync(filename);
  l("removed config file");
}

export function version() {
  l(`${col.b("ntrallazzu")} - ${col.i("ntrz")}\n\tversion: ${v()}`);
}

export function info(config: Config) {
  version();
  l(
    `

        ${col.i("last project opened")}:

                ${col.b(col.cg(config.last)) ?? col.cr("nothing yet...")}

        last refresh run: ${col.b(
          formatTimeAgo(config.lastRefreshed),
        )} - ${col.b(formatDate(config.lastRefreshed))}
        your code editor cmd is: \`${col.b(config.editor)}\`

        ${col.i("code folders")}:
            ${col.b(config.codefolders.join(", "))}

        `,
  );
}

export async function url(config: Config, [term, ...others]: string[]) {
  const opts = parseOptions([term, ...others]);
  const searchOpts = { term: isParam(term) ? null : term };
  const selectedProjectFolder = await findProjectFolderFromArgs(
    config,
    searchOpts,
  );
  if (!Boolean(selectedProjectFolder)) {
    l(
      Boolean(term)
        ? `No projects found with search term "${term}", maybe refresh 'r' or list 'l'?`
        : "no folder to open... try `l` or `r` to refresh?",
    );
    process.exit(1);
  }

  const projectUrl = getProjectUrl(selectedProjectFolder);
  if (!projectUrl) {
    l(
      `${col.cr(
        "Error:",
      )} Could not compute url for project in "${selectedProjectFolder}", is it a github/gitlab/bitbucket/codeberg project?`,
    );
    process.exit(1);
  }

  l(`Git Url for "${col.b(selectedProjectFolder)}":`);
  l(`\n\t${col.cg(projectUrl)}\n`);

  if (!opts.NO_COPY && !config.autoCopy) {
    l(`${col.i("url copied to clipboard!")}\n`);
    clipboard.writeSync(projectUrl);
  }
}
