import { getColor } from "../utils.js";
import { join, parse } from "node:path";
import { log as print } from "node:console";
import { constants } from "node:fs/promises";
import { statSync, accessSync } from "node:fs";
import { config, default_config } from "../index.js";
import { Entry_type, Entry_symbol, Options } from "./types.js";


export default class Entry {
  name: string
  parentPath = ""
  fullPath: string

  constructor(name: string, parentPath = "") {
    const { dir, base } = parse(join(parentPath, name))
    this.name = base
    this.parentPath = dir
    this.fullPath = join(parentPath, name)
  }
  get type() {
    return getEntryType(this)
  }
  private get config() {
    return getEntryConfig(this)
  }
  get icon() {
    return this.config.icon
  }
  get symbol() {
    return getEntrySymbol(this)
  }
  get color() {
    return getColor(this.config.color)
  }
  get icon_color() {
    return getColor(this.config.icon_color)
  }
  get size() {
    return getEntrySize(this)
  }
  get owner(): string {
    return "moha_tangx "
  }
  get group(): string {
    return "moha_tangx "
  }
  print(options: Options) {
    printEntry(this, options)
  }
}

function getEntryType(ent: Entry) {
  let ent_type: Entry_type

  const filters = [
    ["isSymbolicLink", "Link"],
    ["isFile", "Regular"],
    ["isDirectory", "Directory"],
    ["isFIFO", "FIFO"],
    ["isSocket", "Socket"],
  ]
  const stat = statSync(ent.fullPath)
  for (const filter of filters) {
    if (stat[filter[0]]()) {
      ent_type = filter[1] as Entry_type
      break
    }
  }
  if (ent_type == "Regular") {
    try {
      accessSync(ent.fullPath, constants.X_OK)
      return ent_type = Entry_type.Executable
    } catch { }
    if ([".zip", ".gz"].includes(parse(ent.fullPath).ext))
      return ent_type = Entry_type.Compressed
  }
  return ent_type
}

function getEntrySymbol(ent: Entry) {
  const type = getEntryType(ent)
  return Entry_symbol[type] ?? ""
}

function getEntrySize(ent: Entry) {
  return getColor("$ORANGE") + statSync(ent.fullPath).size.toFixed(0).padStart(4, "0").slice(0, 4) + getColor("$RESET") + " "
}

function getEntryConfig(ent: Entry) {
  // match config by file extension or name in user config
  for (const key in config) {
    const { extentions } = config[key]
    const ext_match = ent.type == Entry_type.Directory ? ent.name + Entry_symbol.Directory : ent.name
    if (extentions?.some(e => ext_match.endsWith(e))) {
      return { ...default_config[ent.type], ...config[key] }
    }
  }
  return { ...default_config[ent.type ?? Entry_type.Regular], ...config[ent.type?.toLowerCase()] }
}

function printEntry(ent: Entry, options: Options) {
  let { icon, group, owner, name, size, color, icon_color, symbol } = ent
  size = options.size.selected ? size : ""
  group = options.group.selected ? group : ""
  owner = options.owner.selected ? owner : ""
  symbol = options.symbol.selected ? symbol : ""
  print(`${size}${group}${owner}${icon_color}${icon}${getColor("$RESET")} ${getColor(color)}${name}${getColor("$RESET")}${symbol}`)
}
