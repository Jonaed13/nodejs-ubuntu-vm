/**
 * 🚀 GOTTY + PROOT TROJAN ENGINE (V8 - NUCLEAR APT FIX EDITION)
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

    // 3. Fetch Ubuntu RootFS
    const bashCheckPath = path.join(ROOTFS_DIR, 'bin', 'bash');
    if (!fs.existsSync(bashCheckPath)) {
        const rootfsTar = path.join(__dirname, 'rootfs.tar.gz');
        await downloadFile(ROOTFS_URL, rootfsTar);
        fs.mkdirSync(ROOTFS_DIR, { recursive: true });
        execSync(`tar -xzf ${rootfsTar} -C ${ROOTFS_DIR}`);
        fs.unlinkSync(rootfsTar);
        
        log('Binding DNS Matrix...');
        const etcDir = path.join(ROOTFS_DIR, 'etc');
        if (!fs.existsSync(etcDir)) fs.mkdirSync(etcDir, { recursive: true });
        fs.writeFileSync(path.join(etcDir, 'resolv.conf'), 'nameserver 8.8.8.8\nnameserver 8.8.4.4\n');
        
        log('Injecting developer matrix with Nuclear APT Fix...');
        
        // CRITICAL: This script forces past the blank user and missing GPG keys
        const setupScript = `
            export DEBIAN_FRONTEND=noninteractive
            
            # --- THE NUCLEAR APT FIX ---
            # 1. Force apt to run as root to avoid sandbox drops
            echo 'APT::Sandbox::User "root";' > /etc/apt/apt.conf.d/99-sandbox
            
            # 2. Fix missing _apt user which causes the "user ''" error
            grep -q _apt /etc/passwd || echo "_apt:x:100:65534::/nonexistent:/usr/sbin/nologin" >> /etc/passwd
            
            # 3. Create and forcefully unlock the GPG directory
            mkdir -p /etc/apt/trusted.gpg.d
            chmod -R 777 /etc/apt/trusted.gpg.d
            
            # 4. Bypass signature checks for the very first update
            apt-get update -o Acquire::AllowInsecureRepositories=true -o Acquire::AllowDowngradeToInsecureRepositories=true || true
            
            # 5. Install the official keyring to permanently fix signatures
            apt-get install -y --allow-unauthenticated --no-install-recommends ubuntu-keyring ca-certificates
            
            # --- THE TOOLCHAIN INSTALLATION ---
            # Now run a clean, secure update
            apt-get update
            apt-get install -y --no-install-recommends \\
                curl wget git htop screen nano vim jq zip unzip \\
                python3 python3-pip python3-venv build-essential \\
                fzf ripgrep bat tree net-tools dnsutils gnupg proxychains4 xz-utils
            
            # Install Node.js v20 and TypeScript Stack
            curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
            apt-get install -y nodejs
            npm install -g typescript ts-node yarn
            
            # Install GoLang 1.22.1
            wget https://go.dev/dl/go1.22.1.linux-amd64.tar.gz
            tar -C /usr/local -xzf go1.22.1.linux-amd64.tar.gz
            rm go1.22.1.linux-amd64.tar.gz
            
            # Configure Aliases and Paths
            mkdir -p /root/.local/bin
            ln -s /usr/bin/batcat /root/.local/bin/bat || true
            echo 'export PATH=$PATH:/usr/local/go/bin:/root/.local/bin' >> /root/.bashrc
            
            # Configure Neon Custom Prompt
            echo 'export PS1="\\\\[\\\\e[38;5;45m\\\\]⚡ ImGunpoint@GoTTY\\\\[\\\\e[m\\\\]:\\\\[\\\\e[38;5;82m\\\\]\\\\w\\\\[\\\\e[m\\\\]\\\\$ "' >> /root/.bashrc
        `;
        
        fs.writeFileSync(path.join(ROOTFS_DIR, 'tmp', 'setup.sh'), setupScript);
        execSync(`${PROOT_PATH} -r ${ROOTFS_DIR} -0 -w / /bin/bash /tmp/setup.sh`, { stdio: 'inherit' });
        log('Subsystem built perfectly.');
    } else {
        const etcDir = path.join(ROOTFS_DIR, 'etc');
        if (!fs.existsSync(etcDir)) fs.mkdirSync(etcDir, { recursive: true });
        fs.writeFileSync(path.join(etcDir, 'resolv.conf'), 'nameserver 8.8.8.8\nnameserver 8.8.4.4\n');
    }

    // 4. Hand the Port Over to GoTTY
    log(`Passing execution to GoTTY on port ${PORT}...`);
    const gottyArgs = [
        '-a', '0.0.0.0', // Force external traffic
        '-p', PORT.toString(),
        '-w', // Permit write access
        '--reconnect', 
        '--title-format', 'ImGunpoint Terminal',
        PROOT_PATH, 
        '-r', ROOTFS_DIR,
        '-0', 
        '-w', '/root', 
        '-b', '/proc', '-b', '/dev', '-b', '/sys',
        '/bin/bash', '-c', 'export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/go/bin && export TERM=xterm-256color && if [ -x /usr/bin/screen ]; then export SCREENDIR=/root/.screen && mkdir -p $SCREENDIR && exec /usr/bin/screen -xRR core_session; else echo -e "\\e[91m[WARNING] Screen failed to install. Falling back to standard Bash.\\e[0m" && exec /bin/bash; fi'
    ];

    const gottyProcess = spawn(GOTTY_PATH, gottyArgs, { stdio: 'inherit' });

    gottyProcess.on('close', (code) => {
        log(`GoTTY sequence terminated with code: ${code}`);
        process.exit(code);
    });
}

bootEngine().catch(err => log(`Critical Engine Failure: ${err.message}`));
