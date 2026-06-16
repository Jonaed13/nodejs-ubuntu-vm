FROM ubuntu:22.04

# Prevent frontend interaction flags from freezing the build planner
ENV DEBIAN_FRONTEND=noninteractive

# Install foundational build tools and base packages
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ca-certificates \
    build-essential \
    wget \
    tar \
    && rm -rf /var/lib/apt/lists/*

# Install native Node.js v20 runtime directly on the parent vm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Set up the operational directory matrix
WORKDIR /app

# Pull your core repository directly into the workspace context
RUN git clone https://github.com/IamGunpoint/nodejs-ubuntu-vm.git .

# Install parent node environment dependencies smoothly
RUN npm install || true

# Forward the designated routing port for web dashboard sync
EXPOSE 7860

# Execute the core glass container engine orchestration pipeline
CMD ["node", "server.js"]
