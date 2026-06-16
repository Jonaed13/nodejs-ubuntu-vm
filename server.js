/**
 * 🚀 GOTTY + PROOT TROJAN ENGINE (V4)
 * 👤 User: ImGunpoint
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PORT = process.env.PORT || 7860;

// System Paths
const BIN_DIR = path.join(__dirname, 'bin');
const PROOT_PATH = path.join(BIN_DIR, 'proot');
const GOTTY_PATH = path.join(BIN_DIR, 'gotty');
const ROOTFS_DIR = path.join(__dirname, 'ubuntu-22-rootfs');

// Download URLs
const PROOT_URL = 'https://proot.gitlab.io/proot/bin/proot';
const GOTTY_URL = 'https://github.com/sorenisanerd/gotty/releases/download/v1.5.0/gotty_v1.5.0_linux_amd64.tar.gz';
const ROOTFS_URL = 'https://cdimage.ubuntu.com/ubuntu-base/releases/jammy/release/ubuntu-base-22.04-base-amd64.tar.gz';

function log(msg) {
    console.log(`[ImGunpoint] ⚡ ${msg}`);
}

// Resilient Downloader
function downloadFile(url, outputPath) {
    return new Promise((resolve, reject) => {
        log(`Downloading from: ${url}`);
        const client = url.startsWith('https') ? https : http;

        client.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                return downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed with status: ${response.statusCode}`));
            }
            const fileStream = fs.createWriteStream(outputPath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
        }).on('error', reject);
    });
}

async function bootEngine() {
    log('Initializing Trojan Bootloader...');
    if (!fs.existsSync(BIN_DIR)) fs.mkdirSync(BIN_DIR, { recursive: true });

    // 1. Fetch PRoot
    if (!fs.existsSync(PROOT_PATH)) {
        await downloadFile(PROOT_URL, PROOT_PATH);
        fs.chmodSync(PROOT_PATH, 0o755);
        log('PRoot binary secured.');
    }

    // 2. Fetch GoTTY
    if (!fs.existsSync(GOTTY_PATH)) {
        const gottyTar = path.join(__dirname, 'gotty.tar.gz');
        await downloadFile(GOTTY_URL, gottyTar);
        execSync(`tar -xzf ${gottyTar} -C ${BIN_DIR}`);
        fs.chmodSync(GOTTY_PATH, 0o755);
        fs.unlinkSync(gottyTar);
        log('GoTTY binary secured.');
    }

    // 3. Fetch & Build Ubuntu RootFS with Anti-Ban Tools
    const bashCheckPath = path.join(ROOTFS_DIR, 'bin', 'bash');
    if (!fs.existsSync(bashCheckPath)) {
        const rootfsTar = path.join(__dirname, 'rootfs.tar.gz');
        await downloadFile(ROOTFS_URL, rootfsTar);
        fs.mkdirSync(ROOTFS_DIR, { recursive: true });
        execSync(`tar -xzf ${rootfsTar} -C ${ROOTFS_DIR}`);
        fs.unlinkSync(rootfsTar);
        
        log('Injecting proxychains, Node, and GoLang into virtual subsystem...');
        const setupScript = `
            export DEBIAN_FRONTEND=noninteractive
            apt-get update
            apt-get install -y wget curl git nano proxychains4 build-essential screen htop jq
            
            curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
            apt-get install -y nodejs
            
            wget https://go.dev/dl/go1.22.1.linux-amd64.tar.gz
            tar -C /usr/local -xzf go1.22.1.linux-amd64.tar.gz
            rm go1.22.1.linux-amd64.tar.gz
            
            echo 'export PATH=$PATH:/usr/local/go/bin' >> /root/.bashrc
            echo 'export PS1="\\\\[\\\\e[38;5;45m\\\\]⚡ ImGunpoint@GoTTY\\\\[\\\\e[m\\\\]:\\\\w\\\\$ "' >> /root/.bashrc
        `;
        
        fs.writeFileSync(path.join(ROOTFS_DIR, 'tmp', 'setup.sh'), setupScript);
        execSync(`${PROOT_PATH} -r ${ROOTFS_DIR} -0 -w / /bin/bash /tmp/setup.sh`, { stdio: 'inherit' });
        log('Subsystem built.');
    }

    // 4. Bind DNS for the virtual environment
    try {
        const etcDir = path.join(ROOTFS_DIR, 'etc');
        if (!fs.existsSync(etcDir)) fs.mkdirSync(etcDir, { recursive: true });
        fs.writeFileSync(path.join(etcDir, 'resolv.conf'), 'nameserver 8.8.8.8\nnameserver 8.8.4.4\n');
    } catch (e) {}

    // 5. Hand the Port Over to GoTTY
    log(`Passing execution to GoTTY on port ${PORT}...`);
    const gottyArgs = [
        '-p', PORT.toString(),
        '-w', // Permit write access
        '--reconnect', // Reconnect cleanly on refresh
        '--title-format', 'ImGunpoint Dev Engine',
        PROOT_PATH, // GoTTY executes PRoot
        '-r', ROOTFS_DIR,
        '-0', // Emulate root
        '-w', '/root', // Set working directory to /root
        '-b', '/proc', '-b', '/dev', '-b', '/sys',
        '/bin/bash', '--login' // Boot bash
    ];

    const gottyProcess = spawn(GOTTY_PATH, gottyArgs, { stdio: 'inherit' });

    gottyProcess.on('close', (code) => {
        log(`GoTTY sequence terminated with code: ${code}`);
        process.exit(code);
    });
}

bootEngine().catch(err => log(`Critical Engine Failure: ${err.message}`));
