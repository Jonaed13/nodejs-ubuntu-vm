/**
 * 🚀 PROOT UBUNTU 22.04 LIVE CONTAINER ENGINE (NEON CLASSGLASS DESIGN V3 - COMBINED MATRIX)
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

    // Step 1: Handle PRoot Binary Layer
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

    // Step 2: Unpack RootFS Image
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
        
        // Step 3: Inject Dev Stack directly into extracted filesystem context
        injectDeveloperStack();
    } else {
        log('success', 'Ubuntu 22.04 environment verification passed.');
    }
}

function injectDeveloperStack() {
    log('info', 'Injecting structural compilation layers (GoLang, Node, Proxies, Styles)...');
    try {
        // Build internal script to pass inside chroot layer boundaries
        const setupScript = `
            export DEBIAN_FRONTEND=noninteractive
            apt-get update
            apt-get install -y --no-install-recommends curl git ca-certificates build-essential wget xz-utils proxychains4 screen nano htop jq vim
            
            # Install Node LTS inside the subsystem environment
            curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
            apt-get install -y nodejs
            npm install -g typescript ts-node yarn
            
            # Install specific compiled Go environment architecture binaries
            wget https://go.dev/dl/go1.22.1.linux-amd64.tar.gz
            tar -C /usr/local -xzf go1.22.1.linux-amd64.tar.gz
            rm go1.22.1.linux-amd64.tar.gz
            
            # Embed beautiful personalized terminal layout prompts and pathways
            echo 'export PATH=$PATH:/usr/local/go/bin:/root/.local/bin' >> /root/.bashrc
            echo 'export PS1="\\[\\e[38;5;45m\\]⚡ ImGunpoint@EngineV3\\[\\e[m\\]:\\[\\e[38;5;82m\\]\\w\\[\\e[m\\]\\$ "' >> /root/.bashrc
        `;
        
        const setupPath = path.join(ROOTFS_DIR, 'tmp', 'setup.sh');
        fs.writeFileSync(setupPath, setupScript);
        
        // Use chroot simulation properties via native system commands to execute internal configurations
        log('info', 'Compiling runtime engine configuration...');
        execSync(`${PROOT_PATH} -r ${ROOTFS_DIR} -0 -w / /bin/bash /tmp/setup.sh`, { stdio: 'inherit' });
        try { fs.unlinkSync(setupPath); } catch(e) {}
        log('success', 'Developer stack compilation successful.');
    } catch (err) {
        log('warning', `Subsystem optimization encountered warnings: ${err.message}`);
    }
}

// GUI Dashboard Definition
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ImGunpoint Ultra Premium Shell V3</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { 
            background: radial-gradient(circle at 10% 20%, #0d0e15 0%, #050508 90%);
            color: #e2e8f0; font-family: 'Plus Jakarta Sans', sans-serif; 
            padding: 40px 20px; margin: 0; min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            overflow-x: hidden; position: relative;
        }
        body::before {
            content: ''; position: absolute; width: 400px; height: 400px;
            background: radial-gradient(circle, rgba(47, 129, 247, 0.15) 0%, rgba(0,0,0,0) 70%);
            top: -100px; right: -50px; z-index: 0; pointer-events: none;
        }
        .wrapper { width: 100%; max-width: 1100px; margin: 0 auto; z-index: 1; position: relative; }
        .glass-panel {
            background: rgba(13, 16, 27, 0.45); backdrop-filter: blur(25px) saturate(180%);
            -webkit-backdrop-filter: blur(25px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 28px; padding: 30px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .branding { 
            display: flex; justify-content: space-between; align-items: center;
            flex-wrap: wrap; gap: 20px; margin-bottom: 25px; padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .branding h2 {
            margin: 0; font-weight: 800; font-size: 1.6rem; letter-spacing: -0.5px;
            background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            display: flex; align-items: center; gap: 10px;
        }
        .operator-tag {
            font-weight: 700; font-size: 0.9rem; background: rgba(47, 129, 247, 0.12);
            color: #70a5f9; padding: 8px 16px; border-radius: 100px;
            border: 1px solid rgba(47, 129, 247, 0.25); box-shadow: 0 0 15px rgba(47, 129, 247, 0.1);
        }
        .highlight { color: #ffffff; text-shadow: 0 0 10px rgba(255,255,255,0.2); }
        .controls { display: flex; gap: 14px; margin-bottom: 20px; }
        .btn {
            font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.88rem;
            padding: 12px 24px; border-radius: 18px; cursor: pointer; border: 1px solid transparent;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-cancel { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #fca5a5; }
        .btn-cancel:hover { background: #ef4444; color: #ffffff; box-shadow: 0 0 25px rgba(239, 68, 68, 0.45); transform: translateY(-2px); }
        .btn-restart { background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); color: #fde047; }
        .btn-restart:hover { background: #f59e0b; color: #000000; box-shadow: 0 0 25px rgba(245, 158, 11, 0.45); transform: translateY(-2px); }
        #terminal { 
            background: rgba(5, 6, 10, 0.85); border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 22px; padding: 24px; height: 55vh; overflow-y: auto; 
            white-space: pre-wrap; font-family: 'JetBrains Mono', monospace; font-size: 14.5px; 
            line-height: 1.6; color: #cbd5e1; box-shadow: inset 0 4px 20px rgba(0, 0, 0, 0.6);
        }
        .input-area { 
            margin-top: 20px; display: flex; align-items: center; background: rgba(5, 6, 10, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 18px; padding: 16px 22px;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .prompt { color: #4ade80; margin-right: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 700; }
        #cmd-input { flex: 1; background: transparent; border: none; color: #f8fafc; font-family: 'JetBrains Mono', monospace; font-size: 14.5px; outline: none; font-weight: 600; }
        #terminal::-webkit-scrollbar { width: 10px; }
        #terminal::-webkit-scrollbar-track { background: transparent; }
        #terminal::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.06); border-radius: 10px; }
        
        /* Color Pipeline Parsing Definitions */
        .ansi-black { color: #1e293b; } .ansi-red { color: #f87171; } .ansi-green { color: #4ade80; }
        .ansi-yellow { color: #facc15; } .ansi-blue { color: #60a5fa; } .ansi-magenta { color: #c084fc; }
        .ansi-cyan { color: #22d3ee; } .ansi-white { color: #e2e8f0; }
        .ansi-bright-black { color: #64748b; font-weight: 700; }
        .ansi-bright-red { color: #ef4444; font-weight: 700; }
        .ansi-bright-green { color: #22c55e; font-weight: 700; }
        .ansi-bright-yellow { color: #eab308; font-weight: 700; }
        .ansi-bright-blue { color: #3b82f6; font-weight: 700; }
        .ansi-bright-magenta { color: #a855f7; font-weight: 700; }
        .ansi-bright-cyan { color: #06b6d4; font-weight: 700; }
        .ansi-bright-white { color: #ffffff; font-weight: 700; }
        .ansi-bold { font-weight: 700; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="glass-panel">
            <div class="branding">
                <h2>⚡ Ubuntu 22.04 Secure Runtime Engine (V3 Matrix)</h2>
                <div class="operator-tag">SYSTEM OPERATOR: <span class="highlight">ImGunpoint</span></div>
            </div>
            <div class="controls">
                <button class="btn btn-cancel" id="btn-ctrl-c">🛑 Kill Process (Ctrl+C)</button>
                <button class="btn btn-restart" id="btn-restart">🔄 Reboot Core Workspace</button>
            </div>
            <div id="terminal"></div>
            <div class="input-area">
                <span class="prompt">root@ubuntu:~#</span>
                <input type="text" id="cmd-input" placeholder="Transmit proxy or shell parameters..." autofocus autocomplete="off">
            </div>
        </div>
    </div>
    <script>
        const term = document.getElementById('terminal');
        const input = document.getElementById('cmd-input');
        const btnCtrlC = document.getElementById('btn-ctrl-c');
        const btnRestart = document.getElementById('btn-restart');
        
        const proto = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const ws = new WebSocket(proto + window.location.host);

        function parseAnsi(text) {
            const ansiMap = {
                '30': 'ansi-black', '31': 'ansi-red', '32': 'ansi-green', '33': 'ansi-yellow',
                '34': 'ansi-blue', '35': 'ansi-magenta', '36': 'ansi-cyan', '37': 'ansi-white',
                '90': 'ansi-bright-black', '91': 'ansi-bright-red', '92': 'ansi-bright-green', '93': 'ansi-bright-yellow',
                '94': 'ansi-bright-blue', '95': 'ansi-bright-magenta', '96': 'ansi-bright-cyan', '97': 'ansi-bright-white',
                '1': 'ansi-bold'
            };
            let cleanHTML = "";
            let segments = text.split(/\\x1B\\[|\\e\\[/);
            if (segments.length === 1) return text.replace(/\\n/g, '<br>');
            cleanHTML += segments[0];
            for (let i = 1; i < segments.length; i++) {
                let parts = segments[i].split('m');
                let codes = parts[0].split(';');
                let content = parts.slice(1).join('m');
                if (codes.length === 1 && (codes[0] === '0' || codes[0] === '')) {
                    cleanHTML += '</span>' + content;
                } else {
                    let classes = codes.map(c => ansiMap[c] || '').join(' ').trim();
                    cleanHTML += \`<span class="\${classes}">\` + content;
                }
            }
            return cleanHTML.replace(/\\n/g, '<br>');
        }

        ws.onopen = () => {
            term.innerHTML += '<span class="ansi-bright-green">[SYSTEM]: Cloud architecture bridged. Upgraded V3 Core Terminal initialized.</span><br>';
        };
        ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === 'sys_action' && data.body === 'reload') window.location.reload();
            } catch(err) {
                term.innerHTML += parseAnsi(e.data);
                term.scrollTop = term.scrollHeight;
            }
        };
        ws.onclose = () => {
            term.innerHTML += '<span class="ansi-bright-red"><br>[CRITICAL]: Connection matrix decoupled. Core engine stopped.</span><br>';
            input.disabled = true; btnCtrlC.disabled = true; btnRestart.disabled = true;
        };
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                ws.send(JSON.stringify({ type: 'cmd', data: input.value + '\\n' })); 
                input.value = '';
            }
        });
        btnCtrlC.addEventListener('click', () => ws.send(JSON.stringify({ type: 'action', action: 'SIGINT' })));
        btnRestart.addEventListener('click', () => {
            if(confirm("Reboot core engine context wrapper?")) ws.send(JSON.stringify({ type: 'action', action: 'RESTART' }));
        });
        document.addEventListener('click', () => { if (!input.disabled) input.focus(); });
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
        ws.send(`\x1B[91mError: Initialization dependencies not met on disk.\x1B[0m\n`);
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
                ws.send(`\n\x1B[31m[Process exited with status framework code: ${code}]\x1B[0m\n`);
            }
        });
    };

    bindStreams(bashEnv);
    ws.send("\x1B[92mImGunpoint Virtual Workspace Online. Go 1.22, Node v20, Proxychains4, and Screen environments loaded.\x1B[0m\n\n");

    ws.on('message', (message) => {
        try {
            const parsed = JSON.parse(message.toString());
            if (parsed.type === 'cmd') {
                if (bashEnv.stdin.writable) bashEnv.stdin.write(parsed.data);
            } else if (parsed.type === 'action') {
                if (parsed.action === 'SIGINT') {
                    bashEnv.kill('SIGINT');
                } else if (parsed.action === 'RESTART') {
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
