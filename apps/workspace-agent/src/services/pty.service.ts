import * as pty from 'node-pty';
import * as os from 'os';

export class PtyService {
    private static readonly BASE_DIR: string = process.env.WORKSPACE_DIR || process.cwd();
    
    private ptyProcess: pty.IPty;
    
    constructor() {
        const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

        this.ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: PtyService.BASE_DIR || process.cwd(),
            env: process.env as Record<string, string>
        });

        if (shell === 'bash') {
            const jailScript = `cd() { builtin cd "$@"; if [[ "$PWD" != "${PtyService.BASE_DIR}"* ]]; then echo -e "\\e[31mAccess Denied: Cannot navigate outside workspace.\\e[0m"; builtin cd "${PtyService.BASE_DIR}"; fi; }; clear\r`;
            this.ptyProcess.write(jailScript);
        }
    }

    public write(data: string) {
        this.ptyProcess.write(data);
    }

    public read(callback: (data: string) => void) {
        this.ptyProcess.onData(callback);
    }

    public resize(cols: number, rows: number) {
        this.ptyProcess.resize(cols, rows);
    }

    public kill() {
        this.ptyProcess.kill();
    }
}