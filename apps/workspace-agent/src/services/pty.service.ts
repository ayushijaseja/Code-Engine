import * as pty from 'node-pty';
import * as os from 'os';


export class PtyService {
    private ptyProcess: pty.IPty;

    constructor() {
        const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
        this.ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.INIT_CWD || process.cwd(),
            env: process.env as Record<string, string>
        });
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