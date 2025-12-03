#!/bin/bash
set -e

CONF_DIR="/root/.zcash"
CONF_FILE="$CONF_DIR/zcash.conf"

# Ensure directory exists
mkdir -p "$CONF_DIR"

# Function to create default config
create_config() {
    echo "Creating new zcash.conf..."
    echo "testnet=1" > "$CONF_FILE"
    echo "addnode=testnet.z.cash" >> "$CONF_FILE"
    echo "rpcuser=zcashrpc" >> "$CONF_FILE"
    echo "rpcpassword=password" >> "$CONF_FILE"
    echo "rpcport=18232" >> "$CONF_FILE"
    echo "rpcallowip=0.0.0.0/0" >> "$CONF_FILE"
    echo "txindex=1" >> "$CONF_FILE"
    echo "experimentalfeatures=1" >> "$CONF_FILE"
    echo "insightexplorer=1" >> "$CONF_FILE"
}

# If config doesn't exist, create it
if [ ! -f "$CONF_FILE" ]; then
    create_config
fi

# Ensure deprecation warning is present (idempotent check)
if ! grep -q "i-am-aware-zcashd-will-be-replaced-by-zebrad-and-zallet-in-2025=1" "$CONF_FILE"; then
    echo "Adding deprecation acknowledgement to zcash.conf..."
    echo "i-am-aware-zcashd-will-be-replaced-by-zebrad-and-zallet-in-2025=1" >> "$CONF_FILE"
fi

echo "Starting zcashd..."
exec zcashd -printtoconsole
