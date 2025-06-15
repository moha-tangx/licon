import Entry from "./types/types.js"
import { log as print } from "node:console"
import { Flags, Options } from "./types/types.js"
import { fomartSize, usageMessage, colorize } from "./utils.js"

// entries to be listed
export let SELECTED_PATHS: string[] = []

// flags maps to options
export const FLAGS: Flags = {
  "l": { option: "long", desc: "long list" },
  "g": { option: "group", desc: "show group" },
  "s": { option: "size", desc: "show file size" },
  "F": { option: "symbol", desc: "show file sybol" },
  "A": { option: "almost_all", desc: "almost all" },
  "help": { option: "help", desc: "shows this help message" },
  "h": { option: "help", desc: "short for help" },
  "o": { option: "owner", desc: "shows the owner of the entry" },
  "author": { option: "owner", desc: "show author of the entry" },
  "a": { option: "all", desc: "lists all entries including hidden ones" },
  "R": { option: "recursive", desc: "prints directory entries and all subDirectories entries" }
}

// options and their corresponding actions
export const OPTIONS: Options = {
  long: { selected: false, action: null },
  symbol: { selected: false, action: null },
  owner: { selected: false, action: null },
  group: { selected: false, action: null },
  author: { selected: false, action: null },
  recursive: { selected: false, action: null },
  almost_all: { selected: false, action: null },
  help: { selected: false, action: () => { usageMessage(FLAGS) } },
  size: { selected: false, action: (entries: Entry[]) => { printTotalSize(entries) } },
  all: { selected: false, action: (entries: Entry[]) => ["..", "."].forEach(e => entries.unshift(new Entry(e))) },
}

function printTotalSize(entries: Entry[]) {
  const totalSize = entries.map(e => e.size).reduce((p, c) => p + c);
  print("total", colorize(fomartSize(totalSize), "$ORANGE"))
}
