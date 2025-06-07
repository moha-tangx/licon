#!/usr/bin/env bash
# bundle app

esbuild ./src/index.ts --bundle --format=esm --outfile=./bin/licon  --platform=node --minify &&

# make file executable
chmod 555 ./bin/licon &&

echo -e "✅✅✅"
