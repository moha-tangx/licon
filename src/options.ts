import { Flags, Options } from "./types/types.js"
import { Entry } from "./types/types.js"
import { getColor, usageMessage } from "./utils.js"
export let SELECTED_PATHS: string[] = []

// flags maps to options
export const FLAGS: Flags = {
  "l": { option: "long", desc: "long list" },
  "g": { option: "group", desc: "show group" },
  "s": { option: "size", desc: "show file size" },
  "F": { option: "type", desc: "show file type " },
  "A": { option: "almost_all", desc: "almost all" },
  "help": { option: "help", desc: "shows this help message" },
  "o": { option: "owner", desc: "shows the owner of the entry" },
  "h": { option: "human", desc: "makes file size human readble" },
  "author": { option: "author", desc: "show author of the entry" },
  "a": { option: "all", desc: "lists all entries including hidden ones" },
  "R": { option: "recursive", desc: "prints directory entries and all subDirectories entries" }
}

// options and their corresponding actions
export const OPTIONS: Options = {
  all: { selected: false, action: null },
  recursive: { selected: false, action: null },
  help: { selected: false, action: () => { usageMessage(FLAGS) } },
  long: { selected: false, action: (entries: Entry[]) => { return entries } },
  type: { selected: false, action: (entries: Entry[]) => { return entries } },
  size: { selected: false, action: Size },
  owner: { selected: false, action: (entries: Entry[]) => { return entries } },
  group: { selected: false, action: (entries: Entry[]) => { return entries } },
  human: { selected: false, action: (entries: Entry[]) => { return entries } },
  author: { selected: false, action: (entries: Entry[]) => { return entries } },
  almost_all: { selected: false, action: (entries: Entry[]) => { return entries } }
}

//Gets file size
function Size(entries: Entry[]): Entry[] {
  for (const entry of entries) {
    entry.size = `${getColor("$orange")}${entry.baseEnt.size.toString().padStart(4, "0")} ${getColor("$reset")}`
  }
  return entries;
}
