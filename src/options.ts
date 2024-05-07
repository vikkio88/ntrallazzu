
export const OPTIONS: Record<string, { opts: string[], default?: boolean }> = {
    NO_COPY: { opts: ['-nocp', '-ncp', '--ncp', '--no-cp', '--no-copy'], default: false },
    UPDATE: { opts: ['--up', '--update', '-update', '-up',], default: false },
}



export function parseOptions(args: string[], allowed = OPTIONS) {
    const options = {};
    for (const arg of args) {
        for (const k of Object.keys(allowed)) {
            const opt = allowed[k];
            options[k] = opt.default || false;
            if (opt.opts.includes(arg)) {
                options[k] = true;
            }
        }
    }

    return options;
}