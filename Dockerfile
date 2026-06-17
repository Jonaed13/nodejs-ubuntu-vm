FROM ubuntu:22.04
LABEL maintainer="ImGunpoint"

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=en_US.UTF-8
ENV PATH=$PATH:/usr/local/go/bin

# 1. Install Core Tools natively (No GPG errors here)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates wget git htop screen nano vim jq \
    python3 python3-pip build-essential proxychains4 \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Node 20 & TS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g typescript ts-node yarn

# 3. Install Go 1.22.1
RUN wget https://go.dev/dl/go1.22.1.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.22.1.linux-amd64.tar.gz && \
    rm go1.22.1.linux-amd64.tar.gz

# 4. Install GoTTY directly to the host
RUN curl -sLk https://github.com/sorenisanerd/gotty/releases/download/v1.5.0/gotty_v1.5.0_linux_amd64.tar.gz \
    | tar xzC /usr/local/bin

# 5. Setup workspace
WORKDIR /workspace

# 6. Copy your server.js and package files into the container
COPY . .

# 7. Expose dynamic port and run the Node wrapper
EXPOSE 7860
CMD ["node", "server.js"]
