type Option = Record<string, { opts: string[]; default?: boolean }>;

export const OPTIONS: Option = {
  NO_COPY: {
    opts: ["-nocp", "-ncp", "--ncp", "--no-cp", "--no-copy", "--nocp"],
    default: false,
  },
  UPDATE: { opts: ["--up", "--update", "-update", "-up"], default: false },
  NO_OPEN: {
    opts: ["--no-open", "--noop", "-no", "-noop", "--no", "-no-open"],
    default: false,
  },
};

export function isParam(value: string): boolean {
  return Boolean(value) && (value.startsWith(`--`) || value.startsWith("-"));
}

export function parseOptions(
  args: string[],
  allowed = OPTIONS
): Record<string, boolean> {
  const options = {};

  for (const k of Object.keys(allowed)) {
    const opt = allowed[k];
    options[k] = opt.default || false;
    for (const arg of args) {
      if (!isParam(arg)) {
        continue;
      }
      if (opt.opts.includes(arg)) {
        options[k] = true;
      }
    }
  }

  return options;
}
