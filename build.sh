#!/usr/bin/env bash
#if bundled remove bundled
[ -d ./bin/ ] && rm -r ./bin/

# bundle app
esbuild ./src/index.ts --bundle --format=esm --outfile=./bin/licon  --platform=node --minify &&

# make file executable
chmod 555 ./bin/licon &&

echo -e "✅✅✅"
