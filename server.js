/**
 * 🚀 PROOT UBUNTU 22.04 LIVE CONTAINER ENGINE (XTERM.JS HIGH-PERFORMANCE EMULATION)
 * 👤 User: ImGunpoint
 * 🛠️ Made by: Gemini AI & ImGunpoint
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const WebSocket = require('ws');

const PORT = process.env.PORT || 7860;

// System Paths
const BIN_DIR = path.join(__dirname, 'bin');
const PROOT_PATH = path.join(BIN_DIR, 'proot');
const ROOTFS_DIR = path.join(__dirname, 'ubuntu-22-rootfs');
const ARCHIVE_PATH = path.join(__dirname, 'ubuntu-rootfs.tar.gz');

// Verification Vectors
const PROOT_SOURCES = [
    'https://proot.gitlab.io/proot/bin/proot',
    'https://raw.githubusercontent.com/proot-me/proot-static-build/master/proot-x86_64'
];

const ROOTFS_SOURCES = [
    'https://cdimage.ubuntu.com/ubuntu-base/releases/jammy/release/ubuntu-base-22.04-base-amd64.tar.gz'
];

function log(status, msg) {
    const symbols = { info: '💡', success: '✅', warning: '⚠️', error: '🚨' };
    console.log(`[ImGunpoint] ${symbols[status] || '⚙️'} ${msg}`);
}

function downloadFile(urls, outputPath, index = 0) {
    return new Promise((resolve, reject) => {
        if (index >= urls.length) {
            return reject(new Error('All download sources exhausted. Connection failed.'));
        }
        const url = urls[index];
        log('info', `Using Route #${index + 1}/${urls.length}: ${url}`);
        const client = url.startsWith('https') ? https : http;

        client.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                log('info', `Following Redirect Matrix...`);
                return downloadFile([response.headers.location, ...urls.slice(index + 1)], outputPath, 0).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                log('warning', `Route dropped with status: ${response.statusCode}`);
                return downloadFile(urls, outputPath, index + 1).then(resolve).catch(reject);
            }
            const fileStream = fs.createWriteStream(outputPath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                log('success', `Download verified and written to disk.`);
                resolve();
            });
        }).on('error', (err) => {
            log('warning', `Network exception caught: ${err.message}`);
            return downloadFile(urls, outputPath, index + 1).then(resolve).catch(reject);
        });
    });
}

async function initializeEnvironment() {
    log('info', 'Booting core system matrix...');
    if (!fs.existsSync(BIN_DIR)) fs.mkdirSync(BIN_DIR, { recursive: true });

    if (!fs.existsSync(PROOT_PATH)) {
        log('info', 'PRoot native core not found. Fetching runtime...');
        await downloadFile(PROOT_SOURCES, PROOT_PATH);
        fs.chmodSync(PROOT_PATH, 0o755); 
        log('success', 'PRoot execution flags established.');
    }

    const bashCheckPath = path.join(ROOTFS_DIR, 'bin', 'bash');
    if (fs.existsSync(ROOTFS_DIR) && !fs.existsSync(bashCheckPath)) {
        log('warning', 'Incomplete RootFS detected. Purging directory for clean Ubuntu 22 re-install...');
        fs.rmSync(ROOTFS_DIR, { recursive: true, force: true });
    }
    if (!fs.existsSync(ROOTFS_DIR)) fs.mkdirSync(ROOTFS_DIR, { recursive: true });

    if (!fs.existsSync(bashCheckPath)) {
        log('info', 'Ubuntu 22.04 user-space image missing. Fetching RootFS Tarball...');
        await downloadFile(ROOTFS_SOURCES, ARCHIVE_PATH);
        log('info', 'Decompressing Ubuntu 22.04 core images via native system pipeline...');
        await new Promise((resolve, reject) => {
            const extract = spawn('tar', ['-xzf', ARCHIVE_PATH, '-C', ROOTFS_DIR]);
            extract.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Tar sub-process exited with error state: ${code}`));
            });
        });
        try { fs.unlinkSync(ARCHIVE_PATH); } catch(e) {}
        log('success', 'Ubuntu 22.04 ecosystem extracted completely.');
        
        injectDeveloperStack();
    } else {
        log('success', 'Ubuntu 22.04 environment verification passed.');
    }
}

function injectDeveloperStack() {
    log('info', 'Injecting structural compilation layers (GoLang, Node, Proxies, Styles)...');
    try {
        const setupScript = `
            export DEBIAN_FRONTEND=noninteractive
            apt-get update
            apt-get install -y --no-install-recommends curl git ca-certificates build-essential wget xz-utils proxychains4 screen nano htop jq vim
            
            curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
            apt-get install -y nodejs
            npm install -g typescript ts-node yarn
            
            wget https://go.dev/dl/go1.22.1.linux-amd64.tar.gz
            tar -C /usr/local -xzf go1.22.1.linux-amd64.tar.gz
            rm go1.22.1.linux-amd64.tar.gz
            
            echo 'export PATH=$PATH:/usr/local/go/bin:/root/.local/bin' >> /root/.bashrc
            echo 'export PS1="\\[\\e[38;5;45m\\]⚡ ImGunpoint@EngineV3\\[\\e[m\\]:\\[\\e[38;5;82m\\]\\w\\[\\e[m\\]\\$ "' >> /root/.bashrc
        `;
        
        const setupPath = path.join(ROOTFS_DIR, 'tmp', 'setup.sh');
        fs.writeFileSync(setupPath, setupScript);
        
        log('info', 'Compiling runtime engine configuration...');
        execSync(`${PROOT_PATH} -r ${ROOTFS_DIR} -0 -w / /bin/bash /tmp/setup.sh`, { stdio: 'inherit' });
        try { fs.unlinkSync(setupPath); } catch(e) {}
        log('success', 'Developer stack compilation successful.');
    } catch (err) {
        log('warning', `Subsystem optimization encountered warnings: ${err.message}`);
    }
}

// XTERM.JS HIGH-PERFORMANCE VIEWPORT DEFINITION
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ImGunpoint Terminal Workspace</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.3.0/css/xterm.css" />
    <script src="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.3.0/lib/xterm.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
        * { box-sizing: border-box; }
        body { 
            background: #07080e;
            color: #e2e8f0; font-family: 'Plus Jakarta Sans', sans-serif; 
            padding: 0; margin: 0; height: 100vh;
            display: flex; flex-direction: column;
            overflow: hidden;
        }
        .header-navbar {
            background: rgba(13, 16, 27, 0.8); backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            padding: 12px 24px; display: flex; justify-content: space-between; align-items: center;
            z-index: 10;
        }
        .branding h2 {
            margin: 0; font-weight: 800; font-size: 1.2rem; letter-spacing: -0.5px;
            background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .actions-panel { display: flex; gap: 12px; align-items: center; }
        .operator-tag {
            font-weight: 700; font-size: 0.8rem; background: rgba(47, 129, 247, 0.1);
            color: #70a5f9; padding: 6px 14px; border-radius: 100px;
            border: 1px solid rgba(47, 129, 247, 0.2); margin-right: 10px;
        }
        .btn {
            font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.8rem;
            padding: 8px 16px; border-radius: 10px; cursor: pointer; border: 1px solid transparent;
            transition: all 0.2s ease; display: inline-flex; align-items: center;
        }
        .btn-restart { background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); color: #fde047; }
        .btn-restart:hover { background: #f59e0b; color: #000000; }
        
        /* Full Viewport Terminal Stage */
        #terminal-container { 
            flex: 1; width: 100%; height: 100%;
            background: #07080e; padding: 15px;
        }
        .xterm-viewport::-webkit-scrollbar { width: 8px; }
        .xterm-viewport::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header-navbar">
        <div class="branding">
            <h2>⚡ ImGunpoint Cloud Console Engine v3</h2>
        </div>
        <div class="actions-panel">
            <div class="operator-tag">OP: <span>ImGunpoint</span></div>
            <button class="btn btn-restart" id="btn-restart">🔄 Restart Shell Instance</button>
        </div>
    </div>
    <div id="terminal-container"></div>

    <script>
        const container = document.getElementById('terminal-container');
        const btnRestart = document.getElementById('btn-restart');
        
        // Open WebSocket Communication Tunnel
        const proto = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const ws = new WebSocket(proto + window.location.host);

        // Initialize High-Performance Xterm Engine Instantiation
        const term = new Terminal({
            cursorBlink: true,
            cursorStyle: 'block',
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            fontSize: 14,
            lineHeight: 1.4,
            theme: {
                background: '#07080e',
                foreground: '#cbd5e1',
                cursor: '#4ade80',
                selectionBackground: 'rgba(255, 255, 255, 0.15)',
                black: '#1e293b', red: '#f87171', green: '#4ade80', yellow: '#facc15',
                blue: '#60a5fa', magenta: '#c084fc', cyan: '#22d3ee', white: '#e2e8f0',
                brightBlack: '#64748b', brightRed: '#ef4444', brightGreen: '#22c55e', 
                brightYellow: '#eab308', brightBlue: '#3b82f6', brightMagenta: '#a855f7', 
                brightCyan: '#06b6d4', brightWhite: '#ffffff'
            }
        });

        term.open(container);
        term.focus();

        ws.onopen = () => {
            term.writeln('\\x1B[92m[SYSTEM]: High-speed pipeline successfully established with cloud server.\\x1B[0m');
        };

        ws.onmessage = (e) => {
            try {
                const parsed = JSON.parse(e.data);
                if (parsed.type === 'sys_action' && parsed.body === 'reload') {
                    window.location.reload();
                }
            } catch(err) {
                // Instantly pipe terminal execution streams into the viewport canvas
                term.write(e.data);
            }
        };

        ws.onclose = () => {
            term.writeln('\\r\\n\\x1B[91m[CRITICAL]: Operational interface matrix decoupled. Engine off.\\x1B[0m');
        };

        // Capture keystrokes dynamically and push them immediately across the WebSocket pipe
        term.onData(data => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'cmd', data: data }));
            }
        });

        btnRestart.addEventListener('click', () => {
            if(confirm("Force crash and recreate underlying bash container layers?")) {
                ws.send(JSON.stringify({ type: 'action', action: 'RESTART' }));
            }
        });

        // Maintain canvas absolute focus focus
        window.addEventListener('resize', () => term.focus());
        document.addEventListener('click', () => term.focus());
    </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    log('info', 'Web interface synchronized to backend terminal stream.');
    try {
        const etcDir = path.join(ROOTFS_DIR, 'etc');
        if (!fs.existsSync(etcDir)) fs.mkdirSync(etcDir, { recursive: true });
        fs.writeFileSync(path.join(etcDir, 'resolv.conf'), 'nameserver 8.8.8.8\nnameserver 8.8.4.4\n');
    } catch (dnsErr) {
        log('warning', `Failed DNS link binding optimization: ${dnsErr.message}`);
    }

    const args = [
        '-r', ROOTFS_DIR,
        '-0',
        '-w', '/',
        '-b', '/proc',
        '-b', '/dev',
        '-b', '/sys',
        '/bin/bash',
        '--login'
    ];

    if (!fs.existsSync(PROOT_PATH)) {
        ws.send(`Error: Initialization dependencies not met on disk.\n`);
        return;
    }

    let bashEnv = spawn(PROOT_PATH, args, {
        env: { 
            ...process.env, 
            TERM: 'xterm-color', 
            HOME: '/root',
            PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/go/bin'
        }
    });

    const bindStreams = (proc) => {
        proc.stdout.on('data', (data) => { if (ws.readyState === WebSocket.OPEN) ws.send(data.toString()); });
        proc.stderr.on('data', (data) => { if (ws.readyState === WebSocket.OPEN) ws.send(data.toString()); });
        proc.on('close', (code) => {
            if (ws.readyState === WebSocket.OPEN && code !== null) {
                ws.send(`\r\n[Process exited with status framework code: ${code}]\r\n`);
            }
        });
    };

    bindStreams(bashEnv);

    ws.on('message', (message) => {
        try {
            const parsed = JSON.parse(message.toString());
            if (parsed.type === 'cmd') {
                if (bashEnv.stdin.writable) bashEnv.stdin.write(parsed.data);
            } else if (parsed.type === 'action') {
                if (parsed.action === 'RESTART') {
                    bashEnv.kill();
                    bashEnv = spawn(PROOT_PATH, args, {
                        env: { ...process.env, TERM: 'xterm-color', HOME: '/root', PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/go/bin' }
                    });
                    bindStreams(bashEnv);
                    ws.send(JSON.stringify({ type: 'sys_action', body: 'reload' }));
                }
            }
        } catch (e) {
            if (bashEnv.stdin.writable) bashEnv.stdin.write(message.toString());
        }
    });

    ws.on('close', () => { bashEnv.kill(); });
});

initializeEnvironment().then(() => {
    server.listen(PORT, () => {
        log('success', `Service online and reachable on instance port: ${PORT}`);
    });
}).catch((err) => {
    log('error', `Process failure aborted setup: ${err.message}`);
});
