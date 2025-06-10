#!/usr/bin/env bash
#if bundled remove bundled
[ -f ./bin/licon ] && chmod +w ./bin/licon; rm  ./bin/licon

# bundle app
esbuild ./src/index.ts --bundle --format=esm --outfile=./bin/licon  --platform=node --minify &&

# make file executable
chmod 555 ./bin/licon &&

echo -e "✅✅✅"
