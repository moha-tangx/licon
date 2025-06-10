#! /usr/bin/env node
import { join } from "node:path"
import { statSync } from "node:fs"
import { argv, env } from "node:process"
import { log as print } from "node:console"
import { Config, Entry } from "./types/types.js"
import { readdir, readFile } from "node:fs/promises"
import { OPTIONS, FLAGS, SELECTED_PATHS } from "./options.js"
import { getColor, badOptionMessage, badArgumentMessage } from "./utils.js"

const HOME = env.HOME
const PASSED_ARGS = argv.slice(2)
const default_config_file_path = join(`${HOME}`, ".config/licon/config.json")
const config_file_path = env.licon_config ?? default_config_file_path;

const default_config = {
  "file": { "char": "", "extentions": [], "color": "" },
  "folder": { "char": "", "extentions": [], "color": "" }
}

let config: Config

// try reading the configuration file
try {
  let fileContent = await readFile(config_file_path, { encoding: "utf8" })
  config = JSON.parse(fileContent)
} catch {
  print("could not read config file")
  // use default config if there error reading or parsing config file
  config = default_config;
}

function setSelectedFlags(passed_args: string[]) {
  const entries = passed_args.filter(arg => !arg.startsWith("-")).filter(entry => entry.trim() !== "")
  const fulls = passed_args.filter(arg => arg.startsWith("--")).map(arg => arg.slice(2).split("="))
  const shorts = passed_args.filter(arg => arg.startsWith("-") && !arg.startsWith("--")).flatMap(arg => arg.slice(1).split(""))

  //set shorts first --they have less priority
  for (const short of shorts) {
    if (!FLAGS[short]) badOptionMessage("licon", short)
    OPTIONS[FLAGS[short].option].selected = true
  }

  //then set fulls
  for (const full of fulls) {
    const [key, value] = full
    const option = OPTIONS[FLAGS[key].option]

    if (!FLAGS[key]) badOptionMessage("licon", key)

    //meaning: it needs an argument 
    if (FLAGS[key].args) {
      //if argument is not passed
      if (!value.trim()) badArgumentMessage("licon", key, false)
      //if not a valid argument
      if (!FLAGS[key].args.includes(value.trim()))
        print(`invalid --${key} argument ${value}`)
      // if everything OK 👍🏿 set option=argument in options
      else option.selected = value
    }
    //meaning:full does not needs an argument
    else {
      //if argument passed
      if (value) badArgumentMessage("licon", key, false)
      option.selected = true
    }
  }

  //if directories to be read are given
  if (entries.length)
    for (let i = 0; i < entries.length; i++) SELECTED_PATHS[i] = entries[i];
  // if directory is not selected we read the current (.) directory
  else
    SELECTED_PATHS[0] = "."
}

setSelectedFlags(PASSED_ARGS)

function matchFile(config: Config, entry: Entry) {
  for (const key in config) {
    const ent_name = entry.isDirectory() ? entry.name + "/" : entry.name
    const { color, char, extentions } = config[key]
    if (extentions.some(ext => ent_name.endsWith(ext))) {
      entry.icon = char
      entry.icon_color = getColor(color)
      return entry
    }
  }
  let icon = entry.isDirectory() ? default_config.folder.char : default_config.file.char
  entry.icon = icon
  entry.icon_color = getColor("$blue")
  return entry
}

function transformEntries(entries: Entry[]) {
  // if -a flag not passed remove files starting with period (.)
  if (!(OPTIONS.all.selected || OPTIONS.almost_all.selected)) {
    entries = entries.filter((e: Entry) => !e.name.startsWith("."))
  }
  // if -a flag passed add the current(.) and parent(..) directories
  if (OPTIONS.all.selected) {
    for (let dirName of ["..", "."]) {
      const ent = new Entry(dirName)
      ent.name = dirName
      ent.isDirectory = () => true
      entries.unshift(ent)
    }
  }

  for (const key in OPTIONS) {
    const option = OPTIONS[key];
    // if option is selected and option has a transform action call the action with entries as arg
    if (option.selected && option.action) option.action(entries)
  }

  // add the ICONS
  for (const entry of entries) {
    matchFile(config, entry)
  }
  return entries
}

async function getEntries(entry_name: string): Promise<Entry[]> {
  let entries: Entry[] = []
  try {
    const entry_names = await readdir(entry_name);
    entries = entry_names.map(n => new Entry(n, entry_name))
  } catch (err) {
    return Promise.reject(err)
  }
  return Promise.resolve(entries)
}

async function ListEntries(selections: string[]) {
  for (const selection of selections) {
    // if more than one dir is selected, specify directory being listed
    if (selections.length > 1 && statSync(selection).isDirectory()) print(`${selection}:`)

    let entries: Entry[] = []
    try {
      entries = await getEntries(selection)
    } catch (err) {
      // if entry selection is a file list the file
      if (err.errno == -20) entries.push(new Entry(selection))
      else {
        print(err.message.substring(err.message.indexOf(":") + 2))
        return
      }
    }

    entries = transformEntries(entries)

    if (OPTIONS.recursive.selected) print(`${selection}:`)
    entries.forEach(entry => entry.print())

    // add a blank line if it is not the last listed entry
    if (selections.indexOf(selection) !== selections.length - 1 || OPTIONS.recursive.selected) print("")

    if (OPTIONS.recursive.selected) {
      // remove "." and ".." before recursion
      if (OPTIONS.all.selected) entries.splice(0, 2)

      entries.filter(e => e.isDirectory()).forEach(e => ListEntries([join(e.parentPath, e.name)]))
    }
  }
}

ListEntries(SELECTED_PATHS)
