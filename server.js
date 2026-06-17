/**
 * 🚀 NATIVE GOTTY WRAPPER (NO PROOT)
 * 👤 User: ImGunpoint
 */

const { spawn } = require('child_process');

// Grab the dynamic port from Suga, or fallback to 7860
const PORT = process.env.PORT || 7860;

console.log(`[ImGunpoint] ⚡ Booting Native GoTTY Engine on port ${PORT}...`);

const gottyArgs = [
    '-a', '0.0.0.0', // Force external connection
    '-p', PORT.toString(),
    '-w', // Permit writing
    '--reconnect', 
    '--title-format', 'ImGunpoint Native Terminal',
    '/bin/bash', '-c', 'export TERM=xterm-256color && export PATH=$PATH:/usr/local/go/bin && mkdir -p ~/.screen && exec /usr/bin/screen -xRR core_session'
];

// Spawn GoTTY directly on the host OS
const gotty = spawn('/usr/local/bin/gotty', gottyArgs, { stdio: 'inherit' });

gotty.on('close', (code) => {
    console.log(`[ImGunpoint] 🚨 Engine terminated with code: ${code}`);
    process.exit(code);
});
